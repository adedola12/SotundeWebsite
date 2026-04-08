import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import speechRoutes from "./routes/speechRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

import { connectToDatabase } from "./db.js";

const app = express();
app.set("trust proxy", 1);

/* -------------------- CORS FIRST -------------------- */
const whitelist = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = new Set(whitelist);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;

  try {
    const u = new URL(origin);
    if (allowedOrigins.has(origin)) return true;
    // Allow Vercel preview deployments
    if (u.hostname.endsWith(".vercel.app")) return true;
    return false;
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, cb) {
    if (isAllowedOrigin(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use((req, res, next) => {
  res.setHeader("Vary", "Origin");
  next();
});

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* -------------------- debug (dev only) -------------------- */
if (process.env.NODE_ENV !== "production") {
  app.get("/__debug/db", (_req, res) => {
    const c = mongoose?.connection || {};
    res.json({ dbName: c.name, host: c.host, ok: c.readyState === 1 });
  });
}

/* -------------------- security / logs / parsing -------------------- */
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan("dev"));
app.use(cookieParser());

const JSON_LIMIT = process.env.JSON_LIMIT || "5mb";
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: false, limit: JSON_LIMIT }));

/* -------------------- routes -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/speeches", speechRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (_req, res) =>
  res.json({ status: "ok", app: "Sotunde Website API" }),
);

/* -------------------- errors -------------------- */
app.use((err, _req, res, next) => {
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Invalid JSON body. Send application/json.",
    });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      error: `Request entity too large. Increase JSON_LIMIT (current: ${JSON_LIMIT}).`,
    });
  }
  if (err && /Not allowed by CORS/.test(err.message)) {
    return res.status(403).json({ error: err.message });
  }
  return next(err);
});

app.use(express.static("client/dist"));
app.use((req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

/* -------------------- boot -------------------- */
const port = process.env.PORT || 4000;

try {
  await connectToDatabase(process.env.MONGO_URI);
  app.listen(port, () =>
    console.log(`Sotunde Website Server running on :${port}`),
  );
} catch (err) {
  console.error("DB error", err);
  process.exit(1);
}
