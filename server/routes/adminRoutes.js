import express from 'express';
import Book from '../models/Book.js';
import User from '../models/User.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// 관리자 전용: 모든 사용자 목록 조회
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');  // 비밀번호 제외
    res.json(users);
  } catch (err) {
    console.error('회원 목록 조회 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 관리자 전용: 전자책 등록
router.post('/books', verifyAdmin, async (req, res) => {
  const {
    title,
    slug,
    description,
    originalPrice,
    price,
    titleIndex,
    category,
    kmongUrl,
    zipUrl,
  } = req.body;

  try {
    // 중복 slug 검사
    if (await Book.findOne({ slug })) {
      return res.status(400).json({ message: '이미 존재하는 슬러그입니다.' });
    }
    // 중복 titleIndex 검사
    if (await Book.findOne({ titleIndex: parseInt(titleIndex) })) {
      return res.status(400).json({ message: '이미 존재하는 인덱스입니다.' });
    }

    const newBook = await Book.create({
      title,
      slug,
      description,
      originalPrice: parseInt(originalPrice),
      price: parseInt(price),
      titleIndex: parseInt(titleIndex),
      category,
      fileName: zipUrl,       // Cloudflare ZIP 파일 URL
      kmongUrl: kmongUrl || '',
    });

    res.status(201).json({ message: '등록 완료', book: newBook });
  } catch (err) {
    console.error('등록 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 관리자 전용: 전자책 수정
router.put('/books/:id', verifyAdmin, async (req, res) => {
  const {
    title,
    slug,
    description,
    originalPrice,
    price,
    titleIndex,
    category,
    kmongUrl,
    zipUrl,
  } = req.body;

  try {
    const existingIndex = await Book.findOne({
      _id: { $ne: req.params.id },
      titleIndex: parseInt(titleIndex),
    });
    if (existingIndex) {
      return res.status(400).json({ message: '이미 존재하는 인덱스입니다.' });
    }

    const existingBook = await Book.findById(req.params.id);
    if (!existingBook) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
    }

    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug,
        description,
        originalPrice: parseInt(originalPrice),
        price: parseInt(price),
        titleIndex: parseInt(titleIndex),
        category,
        fileName: zipUrl || existingBook.fileName,
        kmongUrl: kmongUrl || '',
      },
      { new: true }
    );

    res.json({ message: '수정 완료', book: updated });
  } catch (err) {
    console.error('수정 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 관리자 전용: 전자책 삭제
router.delete('/books/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
    }
    res.json({ message: '삭제 완료' });
  } catch (err) {
    console.error('삭제 실패:', err);
    res.status(500).json({ message: '서버 오류' });
  }
});

import nodemailer from "nodemailer";

// 관리자 전용: ZIP 파일 이메일로 발송
router.post("/send-zip", verifyAdmin, async (req, res) => {
  const { slug, email } = req.body;

  try {
    const book = await Book.findOne({ slug });
    if (!book || !book.fileName) {
      return res.status(404).json({ message: "해당 책의 zip 파일이 없습니다." });
    }

    const zipUrl = `https://pub-bb775a03143c476396cd5c6200cab293.r2.dev/${book.fileName}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"커리어북스" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `[커리어북스] ${book.title} 전자책 파일을 보내드립니다`,
      text: "첨부된 zip 파일을 다운로드하여 학습을 시작하세요.",
      attachments: [
        {
          filename: book.fileName,
          path: zipUrl,
        },
      ],
    });

    res.json({ message: "이메일 발송 완료" });
  } catch (err) {
    console.error("이메일 발송 실패:", err);
    res.status(500).json({ message: "이메일 발송 중 오류 발생" });
  }
});

export default router;
