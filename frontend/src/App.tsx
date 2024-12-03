import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Play from "./pages/Play";

const App = () => {
  return (
    <BrowserRouter>
      <div>
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
