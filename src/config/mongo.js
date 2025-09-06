import mongoose from "mongoose";

export default async function connectMongo() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is required");

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri, {
    autoIndex: true,
    maxPoolSize: 10,
  });

  mongoose.connection.on("connected", () => console.log("[mongo] connected"));
  mongoose.connection.on("error", (e) => console.error("[mongo] error", e));
}
