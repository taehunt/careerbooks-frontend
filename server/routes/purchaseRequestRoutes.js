import express from "express";
import Book from "../models/Book.js";
import User from "../models/User.js";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { depositor, email, slug, memo } = req.body;

  if (!depositor || !email || !slug) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  try {
    const book = await Book.findOne({ slug });
    if (!book) {
      return res.status(404).json({ message: "책을 찾을 수 없습니다." });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📥 입금 신청\n\n- 입금자명: ${depositor}\n- 이메일: ${email}\n- 전자책: ${book.title} (${slug})\n- 메모: ${memo || "(없음)"}`,
        }),
      });
    }

    res.json({ message: "신청 완료" });
  } catch (err) {
    console.error("입금 신청 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

export default router;
