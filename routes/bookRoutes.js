// server/routes/bookRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

const router = express.Router();

// 📌 전자책 전체 목록 반환
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// 📌 내가 구매한 책 목록 API
router.get('/my-books', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ message: '사용자 없음' });

  const purchasedBooks = await Promise.all(
    user.purchasedBooks.map(async (pb) => {
      const slug = typeof pb === 'string' ? pb : pb.slug;
      const purchasedAt = typeof pb === 'string' ? null : pb.purchasedAt;
      const book = await Book.findOne({ slug });
      if (!book) return null;

      return {
        title: book.title,
        slug: book.slug,
        fileName: book.fileName,
        purchasedAt: purchasedAt || new Date(0),
      };
    })
  );

  res.json(purchasedBooks.filter((b) => b !== null));
});

// ✅ 구매 여부 확인
router.get('/:slug/access', verifyToken, async (req, res) => {
  const { slug } = req.params;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(401).json({ allowed: false });

  const hasBook = user.purchasedBooks.some(
    (pb) => (typeof pb === 'string' ? pb === slug : pb.slug === slug)
  );

  return res.json({ allowed: hasBook });
});

// ✅ 전자책 구매 API
router.post('/:slug/purchase', verifyToken, async (req, res) => {
  const { slug } = req.params;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(401).json({ message: '사용자 없음' });
  const alreadyPurchased = user.purchasedBooks.some(
    (pb) => (typeof pb === 'string' ? pb === slug : pb.slug === slug)
  );
  if (alreadyPurchased) {
    return res.status(400).json({ message: '이미 구매한 책입니다.' });
  }

  user.purchasedBooks.push({ slug, purchasedAt: new Date() });
  await user.save();

  res.json({ message: '구매 완료' });
});

// ✅ 책 상세 조회 (라우터 최하단)
router.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  const book = await Book.findOne({ slug });
  if (!book) return res.status(404).json({ message: '책을 찾을 수 없습니다.' });
  res.json(book);
});

export default router;
