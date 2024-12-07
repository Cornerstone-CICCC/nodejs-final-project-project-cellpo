// frontend/src/components/Game.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface GameProps {
  userId: string;
  roomId: string;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
}

interface MoveData {
  board: string[];
  currentPlayer: "X" | "O";
}

interface StartGameData {
  playerSymbol: "X" | "O";
  currentPlayer: "X" | "O";
}

interface GameOverData {
  winnerId?: string;
}

let socket: Socket | null = null;

const Game: React.FC<GameProps> = ({ userId, roomId, setRoomId }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [playerSymbol, setPlayerSymbol] = useState<"X" | "O" | "">("");
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    socket = io("http://localhost:3010", {
      withCredentials: true,
    });

    if (socket) {
      socket.emit("joinRoom", { roomId, userId });

      socket.on("startGame", (data: StartGameData) => {
        setPlayerSymbol(data.playerSymbol);
        setCurrentPlayer(data.currentPlayer);
        setIsGameStarted(true);
      });

      socket.on("moveMade", (data: MoveData) => {
        setBoard(data.board);
        setCurrentPlayer(data.currentPlayer);
      });

      socket.on("gameOver", (data: GameOverData) => {
        if (data.winnerId) {
          setWinner(data.winnerId === userId ? "You Win!" : "You Lose!");
        } else {
          setWinner("Draw!!");
        }
        setIsGameOver(true);
      });

      return () => {
        socket?.disconnect();
      };
    }
  }, [roomId, userId]);

  const checkWinner = (board: string[]): string | null => {
    const winningPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes("")) {
      return "Draw";
    }

    return null;
  };

  const handleCellClick = (index: number) => {
    if (!isGameStarted || board[index] || winner || isGameOver) return;
    if (playerSymbol !== currentPlayer) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setIsGameOver(true);
      if (gameWinner === "Draw") {
        setWinner("Draw!!");
        socket?.emit("gameOver", { roomId });
      } else {
        // 勝利者をサーバーが判断できるよう、現在はplayerSymbolと紐付け
        // 実際にはサーバーでroom管理し、X/OとユーザーIDの対応を記録するべき
        const winnerId = userId;
        socket?.emit("gameOver", { roomId, winnerId });
        setWinner("You Win!");
      }
    } else {
      socket?.emit("makeMove", { roomId, move: { board: newBoard } });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
    setIsGameOver(false);
    setIsGameStarted(false);
    setPlayerSymbol("");
    setRoomId("");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Tic Tac Toe</h1>
      {!isGameStarted && <h2>Waiting for another player...</h2>}
      {winner ? (
        <h2>{winner}</h2>
      ) : isGameStarted ? (
        <h2>
          Current Player: {currentPlayer}
          {playerSymbol === currentPlayer ? " (Your Turn)" : ""}
        </h2>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gridGap: "5px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              border: "1px solid black",
              cursor: "pointer",
              backgroundColor: cell ? "#d3d3d3" : "#fff",
            }}
          >
            {cell}
          </div>
        ))}
      </div>
      {isGameOver && (
        <button
          onClick={resetGame}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default Game;
