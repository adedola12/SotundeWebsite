import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export const requireAuth = (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }

    if (!token && req.cookies?.token) token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not authenticated." });

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    const msg = err?.name === "TokenExpiredError" ? "jwt expired" : err.message;
    console.error("requireAuth error:", msg);

    return res.status(401).json({
      message:
        err?.name === "TokenExpiredError"
          ? "Token expired. Please sign in again."
          : "Invalid token.",
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated." });
  if (req.user.userType !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  return next();
};
