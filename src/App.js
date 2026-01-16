import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Search from "./pages/Search";
import News from "./pages/News";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/article/:fbPostId" element={<Article />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
