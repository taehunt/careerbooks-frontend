// 파일 경로: server/routes/purchaseRequestRoutes.js

import express from "express";
import { sendDiscordWebhook } from "../utils/webhook.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { depositor, email, slug, memo } = req.body;

  if (!depositor || !email || !slug) {
    return res.status(400).json({ message: "필수 항목 누락됨" });
  }

  const entry = {
    depositor,
    email,
    slug,
    memo: memo || "",
    createdAt: new Date(),
  };

  // 1. Webhook 전송
  await sendDiscordWebhook(entry);

  // 2. (선택) DB 저장 or 임시 로그 저장 가능
  console.log("📥 입금 요청:", entry);

  res.json({ message: "입금 정보가 전송되었습니다." });
});

export default router;
