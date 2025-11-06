import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/Auth/Login";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navbar />} />
      </Routes>
    </Router>
  );
}

export default App;
