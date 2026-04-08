import Speech from "../models/SpeechModel.js";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";

const FOLDER = "sotunde_website/speeches";

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

export const getAllSpeeches = async (_req, res) => {
  try {
    const speeches = await Speech.find({ published: true }).sort({ date: -1, createdAt: -1 });
    return res.json(speeches);
  } catch (err) {
    console.error("getAllSpeeches error:", err);
    return res.status(500).json({ message: "Failed to fetch speeches." });
  }
};

export const getSpeechBySlug = async (req, res) => {
  try {
    const speech = await Speech.findOne({ slug: req.params.slug.toLowerCase() });
    if (!speech) return res.status(404).json({ message: "Speech not found." });
    return res.json(speech);
  } catch (err) {
    console.error("getSpeechBySlug error:", err);
    return res.status(500).json({ message: "Failed to fetch speech." });
  }
};

export const adminGetAllSpeeches = async (_req, res) => {
  try {
    const speeches = await Speech.find().sort({ createdAt: -1 });
    return res.json(speeches);
  } catch (err) {
    console.error("adminGetAllSpeeches error:", err);
    return res.status(500).json({ message: "Failed to fetch speeches." });
  }
};

export const createSpeech = async (req, res) => {
  try {
    const { title, slug } = req.body;
    if (!title || !slug) return res.status(400).json({ message: "Title and slug are required." });

    const existing = await Speech.findOne({ slug: slug.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Slug already exists." });

    const speech = await Speech.create({ ...req.body, slug: slug.toLowerCase() });
    return res.status(201).json(speech);
  } catch (err) {
    console.error("createSpeech error:", err);
    return res.status(500).json({ message: "Failed to create speech." });
  }
};

export const updateSpeech = async (req, res) => {
  try {
    const allowed = ["title", "slug", "excerpt", "content", "date", "location", "category", "coverImage", "videoUrl", "published", "order"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    if (updates.slug) updates.slug = updates.slug.toLowerCase();

    const speech = await Speech.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!speech) return res.status(404).json({ message: "Speech not found." });
    return res.json(speech);
  } catch (err) {
    console.error("updateSpeech error:", err);
    return res.status(500).json({ message: "Failed to update speech." });
  }
};

export const deleteSpeech = async (req, res) => {
  try {
    const speech = await Speech.findByIdAndDelete(req.params.id);
    if (!speech) return res.status(404).json({ message: "Speech not found." });
    // Clean up Cloudinary image if exists
    if (speech.coverImage) {
      const pid = extractPublicId(speech.coverImage);
      if (pid) await cloudinary.uploader.destroy(pid).catch(() => {});
    }
    return res.json({ message: "Speech deleted." });
  } catch (err) {
    console.error("deleteSpeech error:", err);
    return res.status(500).json({ message: "Failed to delete speech." });
  }
};

export const uploadSpeechImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image file provided." });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: FOLDER, resource_type: "image" },
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
    console.error("uploadSpeechImage error:", err);
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
