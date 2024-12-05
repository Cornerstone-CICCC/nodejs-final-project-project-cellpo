"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
