import "dotenv/config";
import { createServer } from "http";
import express from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import mongoose from "mongoose";

const app = express();
const sessionCookieName = "userId";

app.use(cookieParser());
app.use(json());

app.get("/api/hello", (req, res) => {
    res.send("world");
});

app.post("/api/auth/register", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            res.status(400);
            res.send("Must provide email, username and password");
            return;
        }

        const user = await User.create({
            email,
            username,
            password
        });

        const now = new Date();
        const expires = new Date();
        expires.setDate(now.getDate() + 1);

        res.cookie(sessionCookieName, user._id, {
            httpOnly: true,
            secure: true,
            signed: true,
            expires
        });

        res.status(201);
        res.end();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

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

app.use(express.static("public"));

const server = createServer(app);
const port = process.env.PORT ?? 3000;

async function init() {
    if (!process.env.MONGO_CONNECTION_STRING) {
        throw new Error("Must provide connection string for mongodb");
    }

    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
        dbName: "app-db-name"
    });

    server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
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