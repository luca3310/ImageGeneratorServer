import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import Parse from "parse/node";

const stripe = require("stripe")(process.env.STRIPEKEY);

const endpointSecret = "";

const fulfillOrder = (lineItems: any, metadata: any) => {
  console.log("Fulfilling order", lineItems, metadata);
};

export default async function webhook(req: Request, res: Response) {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error("Error in webhook signature verification:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Retrieve the session with expanded line items and metadata
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["line_items"],
      },
    );

    const lineItems = sessionWithLineItems.line_items;
    const metadata = sessionWithLineItems.metadata; // Access metadata

    let parseQuery = new Parse.Query(Parse.User);
    parseQuery.equalTo("username", metadata.username);

    switch (lineItems.data[0].description) {
      case "Standard":
        try {
          let queryResults = await parseQuery.find();
          const currentTokens = queryResults[0].get("tokens");
          const newTokens = currentTokens + 100;
          queryResults[0].set("tokens", newTokens);
          await queryResults[0].save(null, { useMasterKey: true });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Error adding tokens" });
        }
        break;
      case "Premium":
        try {
          let queryResults = await parseQuery.find();
          const currentTokens = queryResults[0].get("tokens");
          const newTokens = currentTokens + 300;
          queryResults[0].set("tokens", newTokens);
          await queryResults[0].save(null, { useMasterKey: true });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Error adding tokens" });
        }
        break;
      case "Deluxe":
        try {
          let queryResults = await parseQuery.find();
          const currentTokens = queryResults[0].get("tokens");
          const newTokens = currentTokens + 800;
          queryResults[0].set("tokens", newTokens);
          await queryResults[0].save(null, { useMasterKey: true });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Error adding tokens" });
        }
        break;
      default:
        console.log("wrong type in webhook");
    }

    try {
      let queryResults = await parseQuery.find();
      const currentTokens = queryResults[0].get("tokens");
      const newTokens = currentTokens + 100;
      queryResults[0].set("tokens", newTokens);
      await queryResults[0].save(null, { useMasterKey: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error adding tokens" });
    }

    fulfillOrder(lineItems, metadata);
  }

  res.status(200).end();
}
