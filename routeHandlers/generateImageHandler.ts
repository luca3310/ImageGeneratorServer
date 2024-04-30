import { Request, Response } from "express";
import deductTokens from "../libs/deductTokens";
import checkUserTokens from "../libs/checkUserTokens";
import generateImageUrl from "../libs/generateImageUrl";

export default async function generateImage(req: Request, res: Response) {
  const { prompt, style, quality, userId } = req.body;
  try {
    const [currentTokens, user] = await checkUserTokens(userId, 50);

    const imageUrl = await generateImageUrl(prompt, style, quality);

    await deductTokens(currentTokens, 50, user);

    res.json({ imageUrl: imageUrl });
  } catch (error: any) {
    console.error("server error:", error);
    res.status(500).json({ message: error.message });
  }
}
