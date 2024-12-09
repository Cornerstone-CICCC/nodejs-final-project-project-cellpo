// frontend/src/components/Game.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface GameProps {
  userId: string;
  username: string;
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

const Game: React.FC<GameProps> = ({ userId, username, roomId, setRoomId }) => {
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
          setWinner(
            data.winnerId === userId ? "You Win! :)" : "You Lose... X("
          );
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
        setWinner("You Win!😊");
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
      {/* <h1>Tic Tac Toe</h1> */}
      {!isGameStarted && (
        <h2 className="text-2xl font-MICRO">Waiting for another player...</h2>
      )}
      {winner ? (
        <h2 className="mt-10 text-4xl font-MICRO">{winner}</h2>
      ) : isGameStarted ? (
        <h2 className="mt-10 text-5xl font-MICRO">
          Current Player:
          <span
            className={`${
              currentPlayer === "X" ? "text-red-600" : "text-blue-600"
            }`}
          >
            {currentPlayer}
          </span>
          {/* {playerSymbol === currentPlayer ? " (Your Turn)" : ""} */}
        </h2>
      ) : null}
      <div className="grid items-baseline grid-cols-3">
        <div>
          <h2
            className={`font-MICRO m-auto ${
              playerSymbol === "X" ? "bg-red-600" : "bg-blue-600"
            } ${
              playerSymbol === currentPlayer
                ? "text-5xl w-40"
                : "text-xl text-stone-500 brightness-50 w-24"
            }`}
          >
            {username}
          </h2>
          <p>
            {playerSymbol === currentPlayer ? (
              <span className="block text-5xl text-green-600 font-MICRO">
                Your Turn
              </span>
            ) : (
              ""
            )}
          </p>
        </div>

        <div className="grid justify-center grid-cols-3 gap-2 mt-20 bg-green-600 w-[312px] mx-auto shadow-green-600">
          {board.map((cell, index) => (
            <div
              key={index}
              onClick={() => handleCellClick(index)}
              className={`w-[100px] h-[100px] bg-stone-800 flex items-center justify-center  font-PIXELIFY text-8xl ${
                cell === "X" ? "text-red-600" : "text-blue-600"
              } hover:bg-stone-700`}
            >
              {cell}
            </div>
          ))}
        </div>
        <div>
          <h2
            className={`font-MICRO m-auto ${
              playerSymbol !== "X" ? "bg-red-600" : "bg-blue-600"
            } ${
              playerSymbol !== currentPlayer
                ? "text-5xl w-40"
                : "text-xl text-stone-500 brightness-50 w-24"
            }`}
          >
            opponent
          </h2>
          <p>
            {playerSymbol !== currentPlayer ? (
              <span className="block text-5xl text-green-600 font-MICRO">
                Your Turn
              </span>
            ) : (
              ""
            )}
          </p>
        </div>
      </div>
      {isGameOver && (
        <button
          onClick={resetGame}
          // style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
          className="p-3 text-2xl mt-14 bg-stone-500 font-MICRO"
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default Game;
