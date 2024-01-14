import "dotenv/config";
import { createServer } from "http";
import express, { ErrorRequestHandler, RequestHandler } from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import mongoose, { model } from "mongoose";
import { User } from "./users.model";
import { router as authRouter } from "./auth.router";
import { Question, TriviaModel } from "./trivia.model";

export const sessionCookieName = "userId";
const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(json());

const logRequests: RequestHandler = (req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
};

app.use(logRequests);

app.use("/api/auth", authRouter);

app.get("/api/currentUser", async (req, res, next) => {
  try {
    const user = await getUser(req.signedCookies[sessionCookieName]);

    res.status(200);
    res.json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const server = createServer(app);
const port = process.env.PORT ?? 3000;

app.get("/logout", (_, res) => {
  res.cookie("userId", "", { expires: new Date(0) });
  res.send("logged-out");
});

// app.get('/api/trivia/:category/:difficulty', async (req, res) => {
//   const { category, difficulty } = req.params;

//   try {
//     const questions = await model<typeof Question>(`${difficulty}${category}Questions`).find({
//       difficulty,
//       category,
//     });

//   const triviaInstance = new TriviaModel({
//     difficulty,
//     category,
//     questions,
// shareId: generateRandomNumberString(6),
//   });

//   const trivia = await triviaInstance.save();

//   res.json(trivia);
// } catch (error) {
//   console.error('Error fetching trivia:', error);
//   res.status(500).json({ error: 'Internal Server Error' });
// }
// });

async function getRandomQuestions(
  difficulty: string,
  category: string,
  count: number
): Promise<(typeof Question)[]> {
  let pipeline: any[] = [
    { $match: { difficulty } },
    { $sample: { size: count } },
  ];

  if (category !== "Any category") {
    // Include category in the match condition only if it's not "Any category"
    pipeline.unshift({ $match: { category } });
  }

  const randomQuestions = await Question.aggregate(pipeline);

  return randomQuestions;
}

app.post("/api/trivia/generate", async (req, res) => {
  const { difficulty, category } = req.body;

  try {
    const questions = await getRandomQuestions(difficulty, category, 10);

    if (questions.length !== 10) {
      return res
        .status(400)
        .json({
          error: "Not enough questions available for the specified criteria.",
        });
    }

    const trivia = new TriviaModel({
      difficulty,
      category,
      questions,
      shareId: generateRandomNumberString(6),
    });

    await trivia.save();

    res.status(201).json(trivia);
  } catch (error) {
    console.error("Error generating trivia:", error);
    res.status(500).send("Internal Server Error");
  }
});

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

async function getUser(userId?: string) {
  if (!userId) {
    return null;
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error();
  }

  return user;
}

function generateRandomNumberString(length: number): string {
  const randomUUID = Math.random().toString(36).substring(2, 8);
  return randomUUID.substring(0, length);
}
