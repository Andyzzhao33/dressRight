const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 8000;

app.use(cors()); // Allow frontend to call backend

// Storage setup for multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Image Upload Route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  res.json({ message: "File uploaded successfully!", filename: req.file.filename });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
