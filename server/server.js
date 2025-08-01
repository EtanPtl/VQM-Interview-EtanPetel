import express from "express";
import session from "express-session"
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.mjs";
import { Server } from "socket.io";
import { createServer } from "node:http";
import auth from "./auth.mjs";

dotenv.config();
const app = express();
// Hide Port in .env with fall back
const PORT = process.env.PORT || 3000; 
const server = createServer(app);
const io = new Server(server, {
    // Use cors to only allow access from specific origins (not anyone can acess)
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5173", "http://127.0.0.1:5173"]
    }
});

io.on('connection', (socket) => {
    // Connect users to Socket.IO, log the id to see distinct users
    console.log(`User connceted ${socket.id}`);
    socket.on('message', (data) =>{
        console.log(data);
        // Send only first 5 chars of id since its long and will still be unique with 5 chars
        io.emit('message', `${socket.id.substring(0,5)}: ${data}`);
    });
    socket.on('disconnect', () => {
        console.log("user disconnected")
    }); 
});

server.listen(PORT, () => {
    console.log("Listening on Port " + PORT);
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


app.use(express.json());
//Creating Sessions for persistance (eg. if user reloads page they stay logged in)
app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.environment === "production" ? "true" : "auto",
        httpOnly: true,
        sameSite: process.env.environment === "production" ? "none" : "lax",
    }
}))

// Connecting to auth through /auth adress
app.use("/auth", auth);

// For users to join the queue
app.post("/queue", async(req, res) => {
    const { username } = req.session.user
    try {
        const newEntry = await pool.query("INSERT INTO queue (username) VALUE($1)", [username]);
        res.json(newEntry);
    } catch (error) {
        console.log(error.message);
    }
})

// To see a specific user in the queue
app.get("/queue", async(req, res) => {
    try {
        const { id } = req.params;
        const entry = await pool.query("SELECT * FROM queue WHERE queue_id = $1", [id]);
        res.json(entry)
    } catch (error) {
        console.log(error.message);
    }
});

// To see all users in queue (admin)
app.get("/all-queue", async(req, res) => {
    const allEntries = await pool.query("SELECT * FROM queue");
    res.json(allEntries.rows);
})

// To remove someone from queue
app.delete("/queue", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteEntry = await pool.query("DELETE FROM queue WHERE queue_id = $1", [id]);
        res.json("Entry deleted from queue");
    } catch (error) {
        console.log(error.message);
    }
});

// Starting the express server
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});

