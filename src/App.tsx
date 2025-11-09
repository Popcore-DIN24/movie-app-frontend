import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/user/home/Home";
import Login from "./pages/Auth/Login";
import Navbar from "./components/navbar/Navbar";
import "./i18n";

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
