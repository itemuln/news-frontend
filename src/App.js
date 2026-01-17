import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Search from "./pages/Search";
import News from "./pages/News";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminArticleForm from "./pages/AdminArticleForm";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/article/:fbPostId" element={<Article />} />
        <Route path="/search" element={<Search />} />
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/articles/new" element={<AdminArticleForm />} />
        <Route path="/admin/articles/:id/edit" element={<AdminArticleForm />} />
      </Routes>
    </div>
  );
}

export default App;
