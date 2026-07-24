import { GoogleGenAI } from "@google/genai";
import { writerChatResponseSchema } from "../ai/schemas/writerChatResponseSchema.js";
import { WRITER_ASSISTANT_PROMPT } from "../ai/prompts/writerAssistant.prompt.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const writerChat = async (req, res, next) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { history = [], message } = req.body;

    const contents = [
      ...history.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents,
      config: {
        systemInstruction: WRITER_ASSISTANT_PROMPT,
        responseMimeType: "application/json",
        responseSchema: writerChatResponseSchema,
        temperature: 0.8,
      },
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    next(error);
  }
};

export const generateCoverImage = async (req, res, next) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { imagePrompt } = req.body;

    if (!imagePrompt) {
      return res.status(400).json({ message: "imagePrompt is required" });
    }

    try {
      const response = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: "16:9",
          outputMimeType: "image/jpeg"
        }
      });

      if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Failed to generate image.");
      }

      const base64Image = response.generatedImages[0].image.imageBytes;

      const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
        folder: 'blogworld'
      });

      res.json({ imageUrl: uploadResponse.secure_url });
    } catch (genError) {
      console.warn("Imagen generation failed, using fallback:", genError.message);
      // Use pollinations.ai which generates images based on the prompt for free
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1600&height=900&nologo=true`;
      res.json({ imageUrl: fallbackUrl, fallback: true });
    }
  } catch (error) {
    next(error);
  }
};
