import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../data/messages.json");

export const submitMessage = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
  };

  fs.readFile(dbPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read messages file." });
    }

    const db = JSON.parse(data);
    db.messages.push(newMessage);

    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to save message." });
      }

      res.status(201).json({ message: "Message submitted successfully!" });
    });
  });
};
