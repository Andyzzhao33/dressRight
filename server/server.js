import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import axios from "axios";
import { describeClothing, getSuggestions } from "./openaiService.js";
import { getCityName, getWeather } from "./weather.js"; // Import weather functions

const app = express();
const PORT = 8000;
var weather_condition = { temperature: 250, humidity: 50, weather: "sunny", min_temperature: 20, max_temperature: 30 };

app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON payloads

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

  const imagePath = `uploads/${req.file.filename}`;

  try {
    // Get parsed clothing items list
    const clothingItems = await describeClothing(imagePath);

    res.json({
      message: "File uploaded successfully!",
      filename: req.file.filename,
      clothingItems: clothingItems, // Send parsed list instead of raw response
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Image processing failed." });
  }
});

app.post("/suggestions", async (req, res) => {
    console.log("Received request body:", req.body); // Debugging log
  
    const { dressItems } = req.body;
  
    if (!dressItems || !Array.isArray(dressItems)) {
      return res.status(400).json({ message: "Invalid or missing dressItems." });
    }
  
    try {
      // Simulate getting suggestions
      console.log("WEATHER condition:", weather_condition);
      const suggestions = await getSuggestions(dressItems, weather_condition);
  
      res.json({
        suggestions: suggestions,
      });
    } catch (error) {
      console.error("Error processing suggestions:", error);
      res.status(500).json({ message: "Suggestions processing failed." });
    }
  });

// Location Route - Fetch City Name and Weather
app.post("/location", async (req, res) => {
    console.log("Received request body:", req.body); // Debugging log
  
    const { latitude, longitude } = req.body;
  
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and Longitude required." });
    }
  
    try {
      // Get city name from coordinates
      const city = await getCityName(latitude, longitude);
  
      // Get weather data from coordinates
      const weatherData = await getWeather(latitude, longitude);

      weather_condition.temperature = weatherData.temperature;
      weather_condition.humidity = weatherData.humidity;
      weather_condition.weather = weatherData.weather;
      weather_condition.min_temperature = weatherData.min_temperature;
      weather_condition.max_temperature = weatherData.max_temperature;
  
      res.json({
        city: city, // Send back the city name
        location: `Lat: ${latitude}, Lon: ${longitude}`,
        ...weatherData, // Spread weather data into the response
      });

    console.log("Weather condition:", weather_condition);

    } catch (error) {
      console.error("API Error:", error);
      res.status(500).json({ error: "Failed to fetch location and weather data." });
    }
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
