import GalleryItem from "../models/GalleryModel.js";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";

const FOLDER = "sotunde_website/gallery";

const extractPublicId = (url) => {
  try {
    const u = new URL(url);
    const needle = `/${FOLDER}/`;
    const idx = u.pathname.indexOf(needle);
    if (idx === -1) return null;
    let pid = u.pathname.substring(idx + 1);
    const dot = pid.lastIndexOf(".");
    if (dot !== -1) pid = pid.substring(0, dot);
    return pid;
  } catch { return null; }
};

export const getAllGallery = async (_req, res) => {
  try {
    const items = await GalleryItem.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error("getAllGallery error:", err);
    return res.status(500).json({ message: "Failed to fetch gallery." });
  }
};

export const adminGetAllGallery = async (_req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error("adminGetAllGallery error:", err);
    return res.status(500).json({ message: "Failed to fetch gallery." });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: "Image URL is required." });

    const item = await GalleryItem.create(req.body);
    return res.status(201).json(item);
  } catch (err) {
    console.error("createGalleryItem error:", err);
    return res.status(500).json({ message: "Failed to create gallery item." });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const allowed = ["title", "description", "imageUrl", "category", "date", "order", "published"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    const item = await GalleryItem.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Gallery item not found." });
    return res.json(item);
  } catch (err) {
    console.error("updateGalleryItem error:", err);
    return res.status(500).json({ message: "Failed to update gallery item." });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found." });
    if (item.imageUrl) {
      const pid = extractPublicId(item.imageUrl);
      if (pid) await cloudinary.uploader.destroy(pid).catch(() => {});
    }
    return res.json({ message: "Gallery item deleted." });
  } catch (err) {
    console.error("deleteGalleryItem error:", err);
    return res.status(500).json({ message: "Failed to delete gallery item." });
  }
};

export const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided." });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: FOLDER, resource_type: "auto" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    return res.status(201).json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error("uploadGalleryImage error:", err);
    return res.status(500).json({ message: "Image upload failed." });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: "Image URL is required." });

    const publicId = extractPublicId(url);
    if (!publicId) return res.status(400).json({ message: "Could not derive public_id from URL." });

    const result = await cloudinary.uploader.destroy(publicId);
    return res.json({ message: "Image deleted.", publicId, cloudinary: result });
  } catch (err) {
    console.error("deleteImage error:", err);
    return res.status(500).json({ message: "Failed to delete image." });
  }
};
