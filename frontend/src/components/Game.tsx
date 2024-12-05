import React, { useState } from "react";

const Game: React.FC = () => {
  // states
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  //winner logic
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
        return board[a]; // return winner
      }
    }

    if (!board.includes("")) {
      return "Draw"; // Draw result
    }

    return null; // no winner
  };

  // click handler
  const handleCellClick = (index: number) => {
    if (board[index] || winner || isGameOver) return; // do nothing when square is filled or game has ended

    const newBoard = [...board];
    newBoard[index] = currentPlayer; // locate current player's mark("X","O")
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner === "Draw" ? null : gameWinner);
      setIsGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X"); // take a turn
    }
  };

  // reset game
  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
    setWinner(null);
    setIsGameOver(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Tic Tac Toe</h1>
      {winner ? (
        <h2>{winner === "Draw" ? "Draw!!" : `Winner: ${winner}`}</h2>
      ) : (
        <h2>Current Player: {currentPlayer}</h2>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gridGap: "5px",
          justifyContent: "center",
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
            className="hover:bg-slate-400"
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
