"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
// Create server
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Router
app.use("/api/users", user_routes_1.default);
app.get("/", (req, res) => {
    res.status(200).end("hello Cellpo");
});
// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 3010;
const MONGO_URI = process.env.MONGO_DB;
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
})
    .catch((err) => console.error("Failed to connect to MongoDB", err));
