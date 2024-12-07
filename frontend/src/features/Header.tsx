import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed flex items-center justify-between w-full px-10 top bg-stone-700 font-MICRO">
      <NavLink to={"/"}>
        <img src="/tic-tac-toe_logo.png" alt="logo" className="p-2 w-14 h-14" />
      </NavLink>

      <nav className="flex gap-5">
        <NavLink to={"/signIn"} className="text-lg text-stone-300">
          Ranking
        </NavLink>
        <NavLink to={"/signIn"} className="text-lg text-stone-300">
          Sign In
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
