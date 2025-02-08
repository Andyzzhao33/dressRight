import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Secure API key

// Function to encode an image as a Base64 string
const encodeImage = (imagePath) => {
  const imageBuffer = fs.readFileSync(imagePath);
  return imageBuffer.toString("base64");
};

// Function to send an image to OpenAI and get clothing description
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
              text: "Describe the clothing the person in this image is wearing, including type, color, and coverage.",
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

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in OpenAI request:", error);
    return "Failed to analyze image.";
  }
};
