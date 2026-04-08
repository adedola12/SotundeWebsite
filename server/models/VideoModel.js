import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    videoUrl: { type: String, required: true }, // YouTube embed URL
    thumbnailUrl: { type: String },              // Cloudinary or YouTube thumbnail
    category: { type: String, trim: true },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
