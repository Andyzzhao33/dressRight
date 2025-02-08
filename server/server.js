import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { describeClothing } from "./openaiService.js"; // Import OpenAI function

const app = express();
const PORT = 8000;

app.use(cors()); // Allow frontend to call backend

// Storage setup for multer
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage: storage });

// Image Upload Route
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }

  // Get the uploaded image path
  const imagePath = `uploads/${req.file.filename}`;

  try {
    // Send image to OpenAI for clothing description
    const clothingDescription = await describeClothing(imagePath);

    res.json({
      message: "File uploaded successfully!",
      filename: req.file.filename,
      description: clothingDescription, // Add AI-generated description to response
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Image processing failed." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
