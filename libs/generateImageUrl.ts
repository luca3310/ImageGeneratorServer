import axios from "axios";

import dotenv from "dotenv";
dotenv.config();

export default async function generateImageUrl(
  prompt: string,
  style: string,
  quality: string,
) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        style: style,
        quality: quality,
      },
      {
        headers: {
          Authorization: process.env.OPENAIKEY,
        },
      },
    );

    return response.data.data[0].url;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate Image");
  }
}
