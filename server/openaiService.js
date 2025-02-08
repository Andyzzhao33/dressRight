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
export const describeClothing = async (imagePath) => {
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
              text: "Describe the clothing the person in this image is wearing in a simple comma-separated list, e.g., 'red sweater, blue jeans, white sneakers'.",
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
    const clothingItems = description
      .split(/,|\band\b|\n/) // Split by commas, "and", or new lines
      .map(item => item.trim()) // Trim spaces
      .filter(item => item.length > 0); // Remove empty items

    return clothingItems;
  } catch (error) {
    console.error("Error in OpenAI request:", error);
    return ["Error processing image"];
  }
};
