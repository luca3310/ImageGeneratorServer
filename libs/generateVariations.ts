import axios from "axios";
import FormData from "form-data";

export default async function generateVariations(imageBuffer: any) {
  const imageUrls: any[] = [];
  for (let i = 0; i < 3; i++) {
    const formData = new FormData();
    formData.append("model", "dall-e-2");
    formData.append("image", imageBuffer, "image.png");
    formData.append("n", 1);
    formData.append("size", "1024x1024");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/variations",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: process.env.OPENAIKEY,
          },
        },
      );

      imageUrls.push(...response.data.data.map((img: any) => img.url));
    } catch (error) {
      console.log(error);
      throw new Error("Error generating variation");
    }
  }
  return imageUrls;
}
