import express, { Response, Request } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes";

dotenv.config();

// Create server
const app = express();

// Middleware
app.use(express.json());

// Router
app.use("/api/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).end("hello Cellpo");
});

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 3010;
const MONGO_URI = process.env.MONGO_DB!;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`Server is running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));
