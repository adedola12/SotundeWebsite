import mongoose from "mongoose";

const LifestyleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String },
    category: {
      type: String,
      enum: ["travel", "events", "personal"],
      default: "events",
    },
    coverImage: { type: String },
    images: [{ type: String }], // additional Cloudinary URLs
    date: { type: Date },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Lifestyle", LifestyleSchema);
