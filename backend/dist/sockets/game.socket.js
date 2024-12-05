"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGameSocket = void 0;
const setupGameSocket = (io) => {
    io.on("connection", (socket) => {
        // On connect
        console.log(`User connected: ${socket.id}`);
        // On disconnect
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.setupGameSocket = setupGameSocket;
