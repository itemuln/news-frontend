import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Article from "./pages/Article";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
      </Routes>
    </div>
  );
}

export default App;
