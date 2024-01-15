import { createHash } from "crypto";
import { Schema, model } from "mongoose"

interface User {
    email: string,
    username: string,
    password: string,
    points: number,
    challenges: string[]
}

const schema = new Schema<User>({
    email: { type: String, unique: true, required: true },
    username: { type: String, required: true },
    password: {
        type: String,
        required: true,
        set: hashPassword,
        select: false
    },
    points: { type: Number, default: 0, required: true },
    challenges: [{ type: Schema.Types.ObjectId, ref: 'TriviaModel' }]
});

function hashPassword(value: string) {
    const hash = createHash("sha256");
    hash.update(value);

    return hash.digest("base64");
}

export const User = model<User>("User", schema, "users");