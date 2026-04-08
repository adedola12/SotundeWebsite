import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      unique: true,
      enum: ["hero", "biography", "business", "philanthropy", "vision", "quote", "speeches_hero", "library_hero", "lifestyle_hero", "pm_hero", "qs_hero"],
    },
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    content: { type: String },       // rich text / HTML
    imageUrl: { type: String },       // Cloudinary URL
    secondaryImage: { type: String }, // optional second image
    ctaText: { type: String, trim: true },
    ctaLink: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("About", AboutSchema);
