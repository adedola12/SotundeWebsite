import Blog from "../models/BlogModel.js";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";

const FOLDER = "sotunde_website/blog";

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

export const getAllBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (err) {
    console.error("getAllBlogs error:", err);
    return res.status(500).json({ message: "Failed to fetch blogs." });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() });
    if (!blog) return res.status(404).json({ message: "Blog not found." });
    return res.json(blog);
  } catch (err) {
    console.error("getBlogBySlug error:", err);
    return res.status(500).json({ message: "Failed to fetch blog." });
  }
};

export const getFeaturedBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find({ published: true, featured: true }).sort({ createdAt: -1 }).limit(6);
    return res.json(blogs);
  } catch (err) {
    console.error("getFeaturedBlogs error:", err);
    return res.status(500).json({ message: "Failed to fetch featured blogs." });
  }
};

export const adminGetAllBlogs = async (_req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return res.json(blogs);
  } catch (err) {
    console.error("adminGetAllBlogs error:", err);
    return res.status(500).json({ message: "Failed to fetch blogs." });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, slug } = req.body;
    if (!title || !slug) return res.status(400).json({ message: "Title and slug are required." });

    const existing = await Blog.findOne({ slug: slug.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Slug already exists." });

    const blog = await Blog.create({ ...req.body, slug: slug.toLowerCase() });
    return res.status(201).json(blog);
  } catch (err) {
    console.error("createBlog error:", err);
    return res.status(500).json({ message: "Failed to create blog." });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const allowed = ["title", "slug", "excerpt", "content", "author", "category", "tags", "coverImage", "published", "featured", "order"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    if (updates.slug) updates.slug = updates.slug.toLowerCase();

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ message: "Blog not found." });
    return res.json(blog);
  } catch (err) {
    console.error("updateBlog error:", err);
    return res.status(500).json({ message: "Failed to update blog." });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found." });
    if (blog.coverImage) {
      const pid = extractPublicId(blog.coverImage);
      if (pid) await cloudinary.uploader.destroy(pid).catch(() => {});
    }
    return res.json({ message: "Blog deleted." });
  } catch (err) {
    console.error("deleteBlog error:", err);
    return res.status(500).json({ message: "Failed to delete blog." });
  }
};

export const uploadBlogImage = async (req, res) => {
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
    console.error("uploadBlogImage error:", err);
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
