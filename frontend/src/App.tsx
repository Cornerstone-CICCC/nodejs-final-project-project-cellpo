import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Play from "./pages/Play";
import Header from "./feaatures/Header";

const App = () => {
  return (
    <BrowserRouter>
      <div className="h-screen bg-stone-300">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn/" element={<SignIn />} />
          <Route path="/play/" element={<Play />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
