import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true }, // Cloudinary URL
    category: {
      type: String,
      enum: ["events", "travel", "personal", "official", "other"],
      default: "other",
    },
    date: { type: Date },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryItem", GalleryItemSchema);
