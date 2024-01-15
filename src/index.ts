import "dotenv/config";
import { createServer } from "http";
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import mongoose from "mongoose";
import { router as authRouter } from "./auth.router";
import { router as triviaRouter } from "./trivia.router";
import { User } from "./users.model";

export const sessionCookieName = "userId";

const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(json());

const logRequests: RequestHandler = (req, _, next) => {
  console.log(req.method, req.url, req.body);
  next();
};

app.use(logRequests);

app.use("/api/auth", authRouter);
app.use("/api/trivia", triviaRouter);

app.post("/api/updateUserPoints", async (req, res) => {
  const { userId, points } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { $inc: { points } }, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User points updated successfully", user });
  } catch (error) {
    console.error("Error updating user points:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const server = createServer(app);
const port = process.env.PORT ?? 3000;

app.use(express.static("public"));

async function init() {
  if (!process.env.MONGO_CONNECTION_STRING) {
    throw new Error("Must provide connection string for mongodb");
  }

  await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    dbName: "trivial",
  });

  server.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`)
  );
}

init();