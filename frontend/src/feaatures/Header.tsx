import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="flex justify-between bg-slate-700 items-center px-10">
      <NavLink to={"/"}>
        <img src="/tic-tac-toe_logo.png" alt="logo" className="w-14 h-14 p-2" />
      </NavLink>
      <NavLink to={"/signIn"} className="text-stone-300">
        Sing In
      </NavLink>
    </nav>
  );
};

export default Header;
