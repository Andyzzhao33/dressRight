require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Convert image to base64 for OpenAI processing
        const base64Image = req.file.buffer.toString("base64");

        // Send image to OpenAI API (adjust with actual OpenAI vision model)
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4-vision-preview",
                messages: [{ role: "user", content: [{ type: "image_url", image_url: `data:image/jpeg;base64,${base64Image}` }] }],
                max_tokens: 200
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ message: response.data.choices[0].message.content });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ message: "Error processing image" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));