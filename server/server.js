import express from "express";
import session from "express-session"
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { createServer } from "node:http"

dotenv.config();
const app = express();
// Hide Port in .env with fall back
const PORT = process.env.PORT || 3000; 

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/auth", auth);

app.post("/queue", async(req, res) => {
    const { username } = req.session.user
    try {
        const newEntry = await pool.query("INSERT INTO queue (username) VALUE($1)", [username])
    } catch (error) {
        console.log(error.message);
    }
})