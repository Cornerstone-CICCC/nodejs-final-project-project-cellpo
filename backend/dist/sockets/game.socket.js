"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGameSocket = void 0;
const socket_io_1 = require("socket.io");
const user_model_1 = require("../models/user.model");
const rooms = {};
const setupGameSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("joinRoom", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { roomId, userId } = data;
            socket.join(roomId);
            if (!rooms[roomId]) {
                rooms[roomId] = [];
            }
            rooms[roomId].push({ socketId: socket.id, userId });
            if (rooms[roomId].length === 2) {
                // 2人揃ったのでゲーム開始
                io.to(roomId).emit("startGame");
                // 両ユーザのmatchesを1増やす
                for (const player of rooms[roomId]) {
                    yield user_model_1.User.findByIdAndUpdate(player.userId, {
                        $inc: { matches: 1 },
                    });
                }
            }
        }));
        socket.on("makeMove", (data) => {
            const { roomId, move } = data;
            socket.to(roomId).emit("moveMade", move);
        });
        socket.on("gameOver", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { roomId, winnerId } = data;
            if (winnerId) {
                // 勝者のwinsを1増やす
                yield user_model_1.User.findByIdAndUpdate(winnerId, { $inc: { win: 1 } });
            }
            // 部屋リセット
            if (rooms[roomId]) {
                delete rooms[roomId];
            }
            io.to(roomId).emit("gameOver", { winnerId });
        }));
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            for (const roomId in rooms) {
                rooms[roomId] = rooms[roomId].filter((p) => p.socketId !== socket.id);
                if (rooms[roomId].length === 0) {
                    delete rooms[roomId];
                }
            }
        });
    });
};
exports.setupGameSocket = setupGameSocket;
