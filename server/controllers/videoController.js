import Video from "../models/VideoModel.js";

export const getAllVideos = async (_req, res) => {
  try {
    const videos = await Video.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return res.json(videos);
  } catch (err) {
    console.error("getAllVideos error:", err);
    return res.status(500).json({ message: "Failed to fetch videos." });
  }
};

export const adminGetAllVideos = async (_req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    return res.json(videos);
  } catch (err) {
    console.error("adminGetAllVideos error:", err);
    return res.status(500).json({ message: "Failed to fetch videos." });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, videoUrl } = req.body;
    if (!title || !videoUrl) return res.status(400).json({ message: "Title and video URL are required." });
    const video = await Video.create(req.body);
    return res.status(201).json(video);
  } catch (err) {
    console.error("createVideo error:", err);
    return res.status(500).json({ message: "Failed to create video." });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const allowed = ["title", "description", "videoUrl", "thumbnailUrl", "category", "published", "featured", "order"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    const video = await Video.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!video) return res.status(404).json({ message: "Video not found." });
    return res.json(video);
  } catch (err) {
    console.error("updateVideo error:", err);
    return res.status(500).json({ message: "Failed to update video." });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found." });
    return res.json({ message: "Video deleted." });
  } catch (err) {
    console.error("deleteVideo error:", err);
    return res.status(500).json({ message: "Failed to delete video." });
  }
};
