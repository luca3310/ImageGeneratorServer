import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";
import Parse from "parse/node";
const app: Express = express();
import { Response, Request } from "express";

import dotenv from "dotenv";
dotenv.config();

const port = 4242;
// const hostname = ""; // This should be your server's IP or hostname

// const options = {
//  key: fs.readFileSync("server.key"),
//  cert: fs.readFileSync("server.cert"),
// };

Parse.serverURL = "https://parseapi.back4app.com";
Parse.initialize(
  process.env.APPLICATIONIDKEY as string,
  process.env.JAVASCRIPTKEY,
  process.env.MASTERKEY, // This is your Master key (never use it in the frontend)
);

import generateImage from "./routeHandlers/generateImageHandler";
import editImage from "./routeHandlers/editImageHandler";
import createCheckoutSession from "./routeHandlers/stripeHandler";
import webhook from "./routeHandlers/webhookHandler";

app.use(cors());

app.use(express.static("public"));

app.get("/", bodyParser.json(), (req: Request, res: Response) =>
  res.send("testing works"),
);
app.post("/create-checkout-session", bodyParser.json(), createCheckoutSession);
app.post("/generateImage", bodyParser.json(), generateImage);
app.post("/editImage", bodyParser.json(), editImage);
app.post("/webhook", express.raw({ type: "application/json" }), webhook);

// const server = https.createServer(options, app);

// server.listen(port, hostname, () => {
//  console.log(`Server running at https://${hostname}:${port}/`);
// });
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
