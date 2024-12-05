// src / server.ts
import express, { Response, Request } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { setupGameSocket } from "./sockets/game.socket";
import { Server } from "socket.io";

import userRouter from "./routes/user.routes";
import { createServer } from "http";

dotenv.config();

// Create server
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: [
      process.env.COOKIE_SIGN_KEY ?? "default_sign_key",
      process.env.COOKIE_ENCRYPT_KEY ?? "default_encrypt_key",
    ],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Router
app.use("/api/users", userRouter);

app.use((req: Request, res: Response) => {
  res.status(404).send("Access denied.");
});

// Create HTTP server and attach Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 3010;
const MONGO_URI = process.env.MONGO_DB!;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start Socket.IO
    setupGameSocket(io);

    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
