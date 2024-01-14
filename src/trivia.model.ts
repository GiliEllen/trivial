import { Schema , model } from "mongoose";

type Difficulty = "Easy" | "Medium" | "Hard";

type Category = "Any category" | "Sports" | "Animals";


interface Trivia {
    type: string,
    difficulty: Difficulty,
    category: Category,
    question: string,
    correctAnswer: string,
    incorrectAnswers: string[]
}

const schema = new Schema<Trivia>({
    type: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String, enum: ["Any category", "Sports", "Animals"], required: true },
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    incorrectAnswers: { type: [String], default: [] },
  });

export const Trivia = model<Trivia>("Trivia", schema, "trivias");