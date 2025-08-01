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
        const newEntry = await pool.query("INSERT INTO queue (username) VALUE($1)", [username]);
        res.json(newEntry);
    } catch (error) {
        console.log(error.message);
    }
})

app.get("/queue", async(req, res) => {
    try {
        const { id } = req.params;
        const entry = await pool.query("SELECT * FROM queue WHERE queue_id = $1", [id]);
        res.json(entry)
    } catch (error) {
        console.log(error.message);
    }
});

app.get("/all-queue", async(req, res) => {
    const allEntries = await pool.query("SELECT * FROM queue");
    res.json(allEntries.rows);
})