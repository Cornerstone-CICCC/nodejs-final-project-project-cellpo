import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./feaatures/Header";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Play from "./pages/Play";
import Rank from "./pages/Rank";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <div className="h-screen bg-stone-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/play" element={<Play />} />
          <Route path="/rank" element={<Rank />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
