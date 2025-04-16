import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    fileName: String,
    category: String,
    titleIndex: Number,
    price: Number,
    originalPrice: Number,

    // ✅ 판매 횟수 추가
    salesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
