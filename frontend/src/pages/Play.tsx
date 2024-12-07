// frontend/src/pages/Play.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Game from "../components/Game";
// import Button from "../components/Button";

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
    <div className="py-24 text-stone-200 bg-stone-800">
      <div className="flex items-center justify-center gap-4 mt-1">
        {user && (
          <h1 className="text-3xl font-extrabold">
            {user.username.toUpperCase()}'s Stats: {user.matches} Matches /{" "}
            {user.win} Wins
          </h1>
        )}

        {/* <Button onclick={logOut}>Log Out</Button> */}
      </div>

      <div className="mt-5 text-center">
        {/* <h2>Enter Room ID to Start the Game</h2> */}
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-2 py-1 border-none outline-none font-PIXELIFY bg-stone-600 text-stone-200"
          placeholder="Enter Room ID"
        />
      </div>

      {user && roomId && (
        <div className="mt-5">
          <Game
            userId={user._id}
            username={user.username}
            roomId={roomId}
            setRoomId={setRoomId}
          />
        </div>
      )}

      <button
        onClick={logOut}
        className="block p-3 px-10 mx-auto mt-10 text-3xl transition-all duration-300 bg-green-600 rounded-full font-MICRO text-slate-200 hover:bg-green-700"
      >
        Log out
      </button>
    </div>
  );
};

export default Play;
