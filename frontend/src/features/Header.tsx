import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav className="flex items-center justify-between w-full px-10 bg-slate-700 font-MICRO">
      <NavLink to={"/"}>
        <img src="/tic-tac-toe_logo.png" alt="logo" className="p-2 w-14 h-14" />
      </NavLink>
      <NavLink to={"/signIn"} className="text-lg text-stone-300">
        Sign In
      </NavLink>
    </nav>
  );
};

export default Header;
