import { createServer } from "http";
import app from "./app.js";
import connectMongo from "./config/mongo.js";

const port = process.env.PORT || 4000;

await connectMongo();

createServer(app).listen(port, () => {
  console.log(`[lead-module] listening on http://localhost:${port}`);
});
