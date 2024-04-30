import { Request, Response } from "express";
import deductTokens from "../libs/deductTokens";
import checkUserTokens from "../libs/checkUserTokens";
import convertToBase64 from "../libs/convertToBase64";
import generateVariations from "../libs/generateVariations";

export default async function editImage(req: Request, res: Response) {
  const { activeImg, userId } = req.body;

  try {
    const [currentTokens, user] = await checkUserTokens(userId, 25);

    const imageBuffer = await convertToBase64(activeImg);

    const imageUrls = await generateVariations(imageBuffer);

    deductTokens(currentTokens, 25, user);

    res.json({ imageUrl: imageUrls });
  } catch (error: any) {
    console.error("Server error:", error);
    res.status(500).json({ message: error.message });
  }
}
