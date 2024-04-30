const imageToBase64 = require("image-to-base64");

export default async function convertToBase64(activeImg: string) {
  try {
    const base64Data = await imageToBase64(activeImg);
    const buffer = Buffer.from(base64Data, "base64");
    return buffer;
  } catch (error) {
    console.error(error);
    throw new Error("Error converting to Base64");
  }
}
