import "dotenv/config";
import { createServer } from "http";
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import mongoose from "mongoose";
import { router as authRouter } from "./auth.router";
import { router as triviaRouter } from "./trivia.router";

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