import "dotenv/config";
import { createServer } from "http";
import express, { ErrorRequestHandler, RequestHandler } from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import mongoose from "mongoose";
import { User } from "./user.model";

const sessionCookieName = "userId";
const app = express();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(json());

const logRequests: RequestHandler = (req, res, next) => {
    console.log(req.method, req.url, req.body);
    next();
};

app.use(logRequests);

const now = new Date();
const expires = new Date();
expires.setDate(now.getDate() + 1);

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

app.post("/api/auth/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            username,
            password
        });

        if (!user) {
            res.status(401);
            res.send("username and password doesn't match");
            return;
        }

        res.cookie("userId", user._id, {
            httpOnly: true,
            secure: true,
            signed: true,
            expires 
        });
        res.status(200);
        res.send();
    } catch (err) {
        next(err);
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
        dbName: "trivial"
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