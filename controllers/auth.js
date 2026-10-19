import jwt from "jsonwebtoken";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

const normalize = (value) => String(value ?? "").trim();

const createToken = () =>
  jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });

const readToken = (req) =>
  req.cookies?.admin_token ||
  req.headers.authorization?.replace("Bearer ", "");

export const login = (req, res) => {
  const password = normalize(req.body.password);

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin password." });
  }

  const token = createToken();

  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "Login successful", token });
};

export const logout = (_req, res) => {
  res.clearCookie("admin_token");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const me = (req, res) => {
  const token = readToken(req);

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.status(200).json({ authenticated: true, user: decoded });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
};
