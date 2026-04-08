import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    coverImage: { type: String },   // Cloudinary URL
    purchaseLink: { type: String },
    author: { type: String, trim: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Book", BookSchema);
