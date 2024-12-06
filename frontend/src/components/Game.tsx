import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface GameProps {
  userId: string;
  roomId: string;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
}

interface MoveData {
  board: string[];
}

let socket: Socket | null = null;

const Game: React.FC<GameProps> = ({ userId, roomId, setRoomId }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    socket = io("http://localhost:3010", {
      withCredentials: true,
    });

    if (socket) {
      socket.emit("joinRoom", { roomId, userId });

      socket.on("startGame", () => {
        // The game starts now
        setIsGameStarted(true);
      });

      socket.on("moveMade", (data: MoveData) => {
        setBoard(data.board);
        // Switch player turn locally
        setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
      });

      socket.on("gameOver", (data: { winnerId?: string }) => {
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
      [6, 7, 8], // horizontal
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // vertical
      [0, 4, 8],
      [2, 4, 6], // diagonal
    ];

    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // return winner symbol
      }
    }

    if (!board.includes("")) {
      return "Draw"; // Draw result
    }

    return null; // no winner
  };

  const handleCellClick = (index: number) => {
    if (!isGameStarted || board[index] || winner || isGameOver) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setIsGameOver(true);
      if (gameWinner === "Draw") {
        setWinner("Draw!!");
        socket?.emit("gameOver", { roomId });
      } else {
        // Determine the winner's userId
        // Let's assume 'X' player is the first joined user and 'O' is the second
        // For simplicity, we decide the first user who joined gets 'X'.
        // If userId of the current player equals this user then winnerId = userId else different userId
        const winnerId = currentPlayer === "X" ? userId : null;
        socket?.emit("gameOver", { roomId, winnerId });
        setWinner(winnerId ? "You Win!" : "You Lose!");
      }
    } else {
      // switch turn
      setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
      socket?.emit("makeMove", { roomId, move: { board: newBoard } });
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
    setIsGameOver(false);
    setIsGameStarted(false);
    setRoomId("");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Tic Tac Toe</h1>
      {!isGameStarted && <h2>Waiting for another player...</h2>}
      {winner ? (
        <h2>{winner}</h2>
      ) : isGameStarted ? (
        <h2>Current Player: {currentPlayer}</h2>
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
