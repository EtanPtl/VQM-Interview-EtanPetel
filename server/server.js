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