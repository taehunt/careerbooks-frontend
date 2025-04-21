import express from "express";
import { WebhookClient } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { depositor, email, slug, memo } = req.body;
  if (!depositor || !email || !slug) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  try {
    const webhook = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

    await webhook.send({
      content: `📥 입금 신청 도착!\n\n👤 입금자명: ${depositor}\n📧 이메일: ${email}\n📚 책: ${slug}\n📝 메모: ${memo || "없음"}`,
    });

    res.json({ message: "신청 완료" });
  } catch (err) {
    console.error("웹훅 전송 오류:", err);
    res.status(500).json({ message: "웹훅 전송 실패" });
  }
});

export default router;
