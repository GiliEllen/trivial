import { Schema , model } from "mongoose";

type Difficulty = "Easy" | "Medium" | "Hard";

type Category = "Any category" | "Sports" | "Animals";


interface Question {
    type: string;
    difficulty: Difficulty;
    category: Category;
    question: string;
    correctAnswer: string;
    incorrectAnswers: string[];
}

const questionSchema = new Schema<Question>({
    type: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true,  default: "Easy" },
    category: { type: String, enum: ["Any category", "Sports", "Animals"], required: true,  default: "Any category" },
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    incorrectAnswers: { type: [String], default: [] },
  });

export const Question = model<Question>("Question", questionSchema, "questions");

interface Trivia {
    difficulty: Difficulty;
    category: Category;
    questions: Question[];
    shareId: string;
}

const triviaSchema = new Schema<Trivia>({
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true,  default: "Easy" },
    category: { type: String, enum: ["Any category", "Sports", "Animals"], required: true,  default: "Any category" },
    questions: { type: [Question] },
    shareId: { type: String }
})

export const Trivia = model<Trivia>("Trivia", triviaSchema, "trivias");