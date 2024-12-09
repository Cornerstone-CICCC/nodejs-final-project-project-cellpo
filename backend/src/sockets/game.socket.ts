// backend/src/sockets/game.socket.ts
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { User } from "../models/user.model";

interface Player {
  socketId: string;
  userId: string;
  symbol?: "X" | "O";
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

      const players = rooms[roomId];
      players.push({ socketId: socket.id, userId });

      if (players.length === 1) {
        players[0].symbol = "X";
      } else if (players.length === 2) {
        players[1].symbol = "O";

        // 2人揃ったのでゲーム開始
        // 両者のmatchesを+1
        for (const p of players) {
          await User.findByIdAndUpdate(p.userId, { $inc: { matches: 1 } });
        }

        // 両プレイヤーにstartGameイベント送信
        for (const p of players) {
          io.to(p.socketId).emit("startGame", {
            playerSymbol: p.symbol,
            currentPlayer: "X", // 常にXからスタート
          });
        }
      }
    });

    socket.on(
      "makeMove",
      (data: { roomId: string; move: { board: string[] } }) => {
        const { roomId, move } = data;
        const players = rooms[roomId];
        if (!players) return;

        // 現在のcurrentPlayerはクライアントからは受け取らないで、
        // サーバーで管理しても良いが、ここでは省略的にクライアント主導で管理
        // より厳密にするには、サーバー側でcurrentPlayerを状態管理し、
        // 切り替えてからmoveMadeイベントを送るようにする。

        // 次の手番を決めるため、boardをみてXとOの数を比較してturnを決める
        const xCount = move.board.filter((c) => c === "X").length;
        const oCount = move.board.filter((c) => c === "O").length;
        const nextPlayer = xCount > oCount ? "O" : "X";

        io.to(roomId).emit("moveMade", {
          board: move.board,
          currentPlayer: nextPlayer,
        });
      }
    );

    socket.on(
      "gameOver",
      async (data: { roomId: string; winnerId?: string }) => {
        const { roomId, winnerId } = data;
        const players = rooms[roomId];
        if (!players) return;

        // 勝者がいればwinsを+1
        if (winnerId) {
          await User.findByIdAndUpdate(winnerId, { $inc: { win: 1 } });
        }

        io.to(roomId).emit("gameOver", { winnerId });
        delete rooms[roomId];
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      // 部屋から削除
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter((p) => p.socketId !== socket.id);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      }
    });
  });
};
