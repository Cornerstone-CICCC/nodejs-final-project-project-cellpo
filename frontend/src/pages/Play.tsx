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
    <div className="min-h-screen py-24 text-stone-200 bg-stone-800">
      {user && (
        <div className="flex justify-around">
          <div className="flex items-center justify-center gap-4 mt-1 text-xl font-MICRO">
            <h1 className="mr-5 text-3xl">
              <span className="uppercase">{user.username}</span>'s Stats
            </h1>
            <table className="border border-spacing-2">
              <tr className="border border-separate">
                <th className="p-2 text-center border-4">matches</th>
                <th className="p-2 text-center border-4">wins</th>
              </tr>
              <tr className="border">
                <td className="p-2 text-center border-4">{user.matches}</td>
                <td className="p-2 text-center border-4">{user.win}</td>
              </tr>
            </table>
          </div>

          <button
            onClick={logOut}
            className="text-3xl font-MICRO text-stone-500 hover:text-stone-400"
          >
            Log out
          </button>
        </div>
      )}

      {/* <Button onclick={logOut}>Log Out</Button> */}

      <div className="mt-5 text-center">
        {/* <h2>Enter Room ID to Start the Game</h2> */}
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-2 py-1 border-none outline-none mt-14 font-PIXELIFY bg-stone-600 text-stone-200"
          placeholder="Enter Room ID"
        />
      </div>

      {user && roomId && (
        <div className="mt-3">
          <Game
            userId={user._id}
            username={user.username}
            roomId={roomId}
            setRoomId={setRoomId}
          />
        </div>
      )}
    </div>
  );
};

export default Play;
