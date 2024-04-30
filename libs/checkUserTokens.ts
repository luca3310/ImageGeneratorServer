import Parse from "parse/node";

export default async function checkUserTokens(userId: string, amount: number) {
  try {
    const user = await new Parse.Query(Parse.User).get(userId);

    const currentTokens = user.get("tokens");

    if (currentTokens < amount) {
      throw new Error("Not enough tokens");
    }

    return [currentTokens, user];
  } catch (error) {
    console.log(error);
    throw new Error("User not found");
  }
}
