// frontend/src/components/Ranking.tsx
import React, { useEffect, useState } from "react";

interface UserRank {
  username: string;
  matches: number;
  win: number;
  winRate: number;
}

const Ranking: React.FC = () => {
  const [users, setUsers] = useState<UserRank[]>([]);
  const [winRates, setWinRates] = useState<UserRank[]>([]);

  const loadRanking = async () => {
    const res = await fetch("http://localhost:3010/api/users/ranking");
    const data = await res.json();
    console.log(data);
    setUsers(data);
  };

  useEffect(() => {
    loadRanking();
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-stone-800 font-MICRO">
      <h2 className="ml-16 text-5xl font-bold text-green-600">Ranking</h2>
      <ol className="mt-10 text-center">
        {users.map((user, idx) => (
          <li
            key={idx}
            className={`mb-16 ${
              idx === 0
                ? "text-amber-400 text-7xl"
                : idx === 1
                ? "text-stone-300 text-5xl"
                : "text-yellow-600 text-3xl"
            }`}
          >
            {idx === 0 && (
              <img
                src="../../public/finalist-no_background.png"
                alt="trophy"
                className="inline-block h-auto w-14"
              />
            )}{" "}
            {idx + 1}. {user.username} {user.win}
            <span
              className={`${
                idx === 0 ? "text-3xl" : idx === 1 ? "text-xl" : "text-base"
              }`}
            >
              Wins
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Ranking;
