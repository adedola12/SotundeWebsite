import About from "../models/AboutModel.js";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";

const FOLDER = "sotunde_website/about";

export const getAllAboutSections = async (_req, res) => {
  try {
    const sections = await About.find().sort({ order: 1 });
    return res.json(sections);
  } catch (err) {
    console.error("getAllAboutSections error:", err);
    return res.status(500).json({ message: "Failed to fetch about sections." });
  }
};

export const getAboutSection = async (req, res) => {
  try {
    const section = await About.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ message: "Section not found." });
    return res.json(section);
  } catch (err) {
    console.error("getAboutSection error:", err);
    return res.status(500).json({ message: "Failed to fetch section." });
  }
};

export const upsertAboutSection = async (req, res) => {
  try {
    const { section } = req.body;
    if (!section) return res.status(400).json({ message: "Section identifier is required." });

    const result = await About.findOneAndUpdate(
      { section },
      { ...req.body },
      { new: true, upsert: true, runValidators: true }
    );
    return res.json(result);
  } catch (err) {
    console.error("upsertAboutSection error:", err);
    return res.status(500).json({ message: "Failed to save about section." });
  }
};

export const uploadAboutImage = async (req, res) => {
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
    console.error("uploadAboutImage error:", err);
    return res.status(500).json({ message: "Image upload failed." });
  }
};
