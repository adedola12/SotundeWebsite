import mongoose from "mongoose";

const SpeechSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, trim: true },
    content: { type: String }, // full speech HTML/text
    date: { type: Date },
    location: { type: String, trim: true },
    category: { type: String, trim: true, default: "Speech" },
    coverImage: { type: String }, // Cloudinary URL
    videoUrl: { type: String },  // YouTube/external video link
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Speech", SpeechSchema);
