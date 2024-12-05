import { Server, Socket } from "socket.io";

const setupGameSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // On connect
    console.log(`User connected: ${socket.id}`);

    // On disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
