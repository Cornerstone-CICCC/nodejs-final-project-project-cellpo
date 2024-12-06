import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { User } from "../models/user.model";

interface Player {
  socketId: string;
  userId: string;
}

const rooms: { [key: string]: Player[] } = {};

export const setupGameSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", async (data: { roomId: string; userId: string }) => {
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
          await User.findByIdAndUpdate(player.userId, {
            $inc: { matches: 1 },
          });
        }
      }
    });

    socket.on("makeMove", (data: { roomId: string; move: any }) => {
      const { roomId, move } = data;
      socket.to(roomId).emit("moveMade", move);
    });

    socket.on(
      "gameOver",
      async (data: { roomId: string; winnerId?: string }) => {
        const { roomId, winnerId } = data;

        if (winnerId) {
          // 勝者のwinsを1増やす
          await User.findByIdAndUpdate(winnerId, { $inc: { win: 1 } });
        }

        // 部屋リセット
        if (rooms[roomId]) {
          delete rooms[roomId];
        }

        io.to(roomId).emit("gameOver", { winnerId });
      }
    );

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
