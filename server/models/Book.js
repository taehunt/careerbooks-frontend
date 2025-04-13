// server/models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },           // 전자책 제목
  slug: { type: String, required: true, unique: true }, // 고유 식별자 (frontend01 등)
  description: String,                                // 설명
  fileName: { type: String, required: true }          // 실제 파일명 (PDF, ZIP 등)
});

export default mongoose.model('Book', bookSchema);
