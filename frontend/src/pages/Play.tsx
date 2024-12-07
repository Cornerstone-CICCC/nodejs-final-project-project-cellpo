// frontend/src/pages/Play.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Game from "../components/Game";
import Ranking from "../components/Ranking";

interface UserData {
  _id: string;
  username: string;
  matches: number;
  win: number;
}

const Play: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [roomId, setRoomId] = useState<string>("");

  const logOut = async (): Promise<void> => {
    await fetch(`http://localhost:3010/api/users/logout`, {
      method: "GET",
      credentials: "include",
    });
    navigate("/signIn");
  };

  const loadProfile = async (): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:3010/api/users/play`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mt-1">
        {user && (
          <h1 className="text-3xl font-extrabold">
            {user.username}'s Stats: {user.matches} Matches / {user.win} Wins
          </h1>
        )}
        <button
          type="button"
          onClick={logOut}
          className="px-2 border-2 border-blue-600 rounded-md hover:text-gray-50 hover:bg-blue-600"
        >
          Log Out
        </button>
      </div>

      <div className="mt-5 text-center">
        <h2>Enter Room ID to Start the Game</h2>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-2 py-1 border"
          placeholder="Room ID"
        />
      </div>

      {user && roomId && (
        <div className="mt-5">
          <Game userId={user._id} roomId={roomId} setRoomId={setRoomId} />
        </div>
      )}
      <Ranking />
    </div>
  );
};

export default Play;
