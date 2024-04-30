import Parse from "parse/node";

export default async function deductTokens(
  currentTokens: number,
  amount: number,
  user: Parse.User,
) {
  const newTokens = currentTokens - amount;
  user.set("tokens", newTokens);
  await user.save(null, { useMasterKey: true });
}
