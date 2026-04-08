import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "48h";

const isProd = process.env.NODE_ENV === "production";

const tokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 48 * 60 * 60 * 1000,
  path: "/",
};

const buildUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  userType: user.userType,
});

function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, userType: user.userType },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      userType: "admin",
    });

    const token = signToken(user);
    res.cookie("token", token, tokenCookieOptions);

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: buildUserResponse(user),
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error during signup." });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = signToken(user);
    res.cookie("token", token, tokenCookieOptions);

    return res.json({
      message: "Signin successful",
      token,
      user: buildUserResponse(user),
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Server error during signin." });
  }
};

export const signout = async (_req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ message: "Signed out" });
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "_id email userType",
    );
    if (!user) return res.status(401).json({ message: "Not authenticated." });

    return res.json({
      user: { id: user._id, email: user.email, userType: user.userType },
    });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
