import { Router } from "express";
import jwt from "jsonwebtoken";

const authRouter = Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@minana.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

const normalize = (value) => String(value ?? "").trim();

const createToken = (email) =>
  jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });

authRouter.post("/login", (req, res) => {
  const email = normalize(req.body.email);
  const password = normalize(req.body.password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const validEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const validPassword = password === ADMIN_PASSWORD;

  if (!validEmail || !validPassword) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  const token = createToken(email);

  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "Login successful", token });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("admin_token");
  return res.status(200).json({ message: "Logged out successfully" });
});

authRouter.get("/me", (req, res) => {
  const token = req.cookies?.admin_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ authenticated: true, user: decoded });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
});

export default authRouter;
