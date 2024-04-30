import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const stripe = require("stripe")(process.env.STRIPEKEY);

const YOUR_DOMAIN = "http://127.0.0.1:5174";

export default async function createCheckoutSession(
  req: Request,
  res: Response,
) {
  const { username, type } = req.body;

  let session: any;

  try {
    switch (type) {
      case "standard":
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Standard",
                },

                unit_amount: 399,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${YOUR_DOMAIN}/success`,
          cancel_url: `${YOUR_DOMAIN}/cancel`,
          metadata: {
            username: username,
          },
        });
        break;
      case "premium":
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Premium",
                },

                unit_amount: 799,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${YOUR_DOMAIN}/success`,
          cancel_url: `${YOUR_DOMAIN}/cancel`,
          metadata: {
            username: username,
          },
        });
        break;
      case "deluxe":
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Deluxe",
                },

                unit_amount: 1499,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${YOUR_DOMAIN}/success`,
          cancel_url: `${YOUR_DOMAIN}/cancel`,
          metadata: {
            username: username,
          },
        });
        break;
      default:
        res.status(500).send("Wrong type");
    }
    res.json({ url: session.url }); // <-- this is the changed line
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}
