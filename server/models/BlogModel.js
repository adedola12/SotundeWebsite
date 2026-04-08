import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String }, // full article HTML/text
    author: { type: String, trim: true },
    category: {
      type: String,
      enum: ["thought-leadership", "lifestyle", "business", "philanthropy", "news", "other"],
      default: "other",
    },
    tags: [{ type: String, trim: true }],
    coverImage: { type: String }, // Cloudinary URL
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
