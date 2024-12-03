"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/user.routes.ts
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = (0, express_1.Router)();
userRouter.get("/", user_controller_1.default.getAllUsers);
userRouter.get("/:id", user_controller_1.default.getUserById);
userRouter.get("/profile", user_controller_1.default.userProfile);
userRouter.post("/register", user_controller_1.default.registerUser);
userRouter.post("/login", user_controller_1.default.loginUser);
userRouter.post("/logout", user_controller_1.default.logoutUser);
exports.default = userRouter;
