import Book from "../models/BookModel.js";
import cloudinary from "../cloudinary.js";
import streamifier from "streamifier";

const FOLDER = "sotunde_website/books";

export const getAllBooks = async (_req, res) => {
  try {
    const books = await Book.find({ published: true }).sort({ order: 1, createdAt: -1 });
    return res.json(books);
  } catch (err) {
    console.error("getAllBooks error:", err);
    return res.status(500).json({ message: "Failed to fetch books." });
  }
};

export const adminGetAllBooks = async (_req, res) => {
  try {
    const books = await Book.find().sort({ order: 1, createdAt: -1 });
    return res.json(books);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch books." });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required." });
    const book = await Book.create(req.body);
    return res.status(201).json(book);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create book." });
  }
};

export const updateBook = async (req, res) => {
  try {
    const allowed = ["title", "author", "description", "coverImage", "purchaseLink", "published", "order"];
    const updates = {};
    for (const key of allowed) { if (key in req.body) updates[key] = req.body[key]; }
    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: "Book not found." });
    return res.json(book);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update book." });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });
    return res.json({ message: "Book deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete book." });
  }
};

export const uploadBookImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided." });
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: FOLDER, resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    return res.status(201).json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    return res.status(500).json({ message: "Image upload failed." });
  }
};
