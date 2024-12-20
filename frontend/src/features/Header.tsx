import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed flex items-center justify-between w-full px-10 top bg-stone-700 font-PIXELIFY">
      <NavLink to={"/"}>
        <img
          src="/tic-tac-toe_lg-no_background.png"
          alt="logo"
          className="p-2 w-14 h-14"
        />
      </NavLink>

      <nav className="flex gap-5 text-sm">
        <NavLink to={"/ranking"} className="text-lg text-stone-300">
          Ranking
        </NavLink>
        <NavLink to={"/signIn"} className="text-lg text-stone-300">
          Login
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
