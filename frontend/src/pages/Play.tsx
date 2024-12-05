import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Game from "../components/Game";

const Play: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");

  const logOut = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await fetch(`http://localhost:3010/api/users/logout`, {
      method: "GET",
      credentials: "include",
    });
    navigate("/signIn");
  };

  const loadProfile = async (): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:3010/api/users/profile`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      setTitle(
        `${
          data.username.substring(0, 1).toUpperCase() +
          data.username.substring(1)
        }'s Word List`
      );
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
      <h1 className="mt-1 text-3xl font-extrabold text-center">{title}</h1>
      <button
        type="submit"
        onClick={logOut}
        className="px-2 ml-5 border-2 border-blue-600 rounded-md hover:text-gray-50 hover:bg-blue-600 "
      >
        Log Out
      </button>

      <div>Play right now</div>

      <Game />
    </div>
  );
};

export default Play;
