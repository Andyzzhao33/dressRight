import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to encode an image as a Base64 string
const encodeImage = (imagePath) => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
};

// Function to process image with OpenAI and extract clothing items
export const describeClothing = async (imagePath, weather_condition) => {
//   console.log("Weather condition:", weather_condition);
  try {
    const base64Image = encodeImage(imagePath);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Describe the person's clothing in the image as a simple semi-colon-separated list. End the list with a natural, human-like comment on whether the outfit is appropriate for current temperature at ${weather_condition.temperature} degrees celcius, humidity at ${weather_condition.humidity}, weather condition at ${weather_condition.weather}, min temperature at ${weather_condition.min_temperature} degrees celcius, and max temperature at ${weather_condition.max_temperature} degrees celcius considering warmth and comfort. Example:
                “red sweater; blue jeans; white sneakers; This outfit is a good fit—warm enough with the sweater and pants. However, adding a light jacket would provide extra comfort, especially if staying outside for an extended period."`
                // text: `Describe the person's clothing in the image as a simple semi-colon-separated list. End the list with a natural, human-like comment on whether the outfit is appropriate for current temperature at 30 degrees celcius considering warmth and comfort. Example:
                // “red sweater; blue jeans; white sneakers; This outfit is a good fit—warm enough with the sweater and pants. However, adding a light jacket would provide extra comfort, especially if staying outside for an extended period."`
            
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
      store: true,
    });

    const description = response.choices[0].message.content;

    // Parse the description into a list
    // console.log("Clothing description:", description);
    const clothingItems = description
      .split(';') // Split by semicolon
      .map(item => item.trim()) // Trim spaces
      .filter(item => item.length > 0); // Remove empty items

    return clothingItems;
  } catch (error) {
    console.error("Error in OpenAI request:", error);
    return ["Error processing image"];
  }
};
