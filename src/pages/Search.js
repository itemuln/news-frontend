import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import "../styles/layout.css";
import "../styles/search-results.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Fetch all articles and filter client-side (simple approach)
    // For production, you'd want a server-side search endpoint
    fetch(`${API_BASE}/api/articles?page=1&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || [];
        const searchLower = query.toLowerCase();
        const filtered = items.filter(
          (article) =>
            article.headline.toLowerCase().includes(searchLower) ||
            (article.body && article.body.toLowerCase().includes(searchLower))
        );
        setResults(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setResults([]);
        setLoading(false);
      });
  }, [query]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="search-page">
      <TopBar />
      <Header />

      <div className="search-page-content">
        <main className="search-main">
          <div className="search-header">
            <h1 className="search-page-title">
              Хайлтын үр дүн: "{query}"
            </h1>
            <p className="search-count">
              {loading ? "Хайж байна..." : `${results.length} үр дүн олдлоо`}
            </p>
          </div>

          {loading ? (
            <div className="loading">Хайж байна...</div>
          ) : results.length === 0 ? (
            <div className="no-results">
              <p>"{query}" хайлтаар үр дүн олдсонгүй.</p>
              <Link to="/">← Нүүр хуудас руу буцах</Link>
            </div>
          ) : (
            <div className="search-results">
              {results.map((article) => (
                <article key={article.fb_post_id} className="search-result-item">
                  {article.image_url && (
                    <Link to={`/article/${article.fb_post_id}`} className="result-image">
                      <img src={article.image_url} alt="" loading="lazy" />
                    </Link>
                  )}
                  <div className="result-content">
                    <Link to={`/article/${article.fb_post_id}`}>
                      <h2 className="result-title">{article.headline}</h2>
                    </Link>
                    <time className="result-date">{formatDate(article.published_at)}</time>
                    {article.body && (
                      <p className="result-excerpt">
                        {article.body.substring(0, 150)}...
                      </p>
                    )}
                    <Link to={`/article/${article.fb_post_id}`} className="result-link">
                      Унших →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
