import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/news-page.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/api/articles?page=${page}&limit=12`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.items || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, [page]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Header />
      <main className="news-page">
        <div className="news-page-container">
          <h1 className="news-page-title">Бүх мэдээ</h1>

          {loading ? (
            <div className="news-loading">Уншиж байна...</div>
          ) : (
            <>
              <div className="news-grid">
                {articles.map((article) => (
                  <Link
                    key={article.fb_post_id}
                    to={`/article/${article.fb_post_id}`}
                    className="news-card"
                  >
                    {article.image_url && (
                      <div className="news-card-image">
                        <img src={article.image_url} alt="" loading="lazy" />
                      </div>
                    )}
                    <div className="news-card-content">
                      <h2 className="news-card-title">{article.headline}</h2>
                      <time className="news-card-date">
                        {formatDate(article.published_at)}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="news-pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Өмнөх
                  </button>
                  <span className="pagination-info">
                    {page} / {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Дараах →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
