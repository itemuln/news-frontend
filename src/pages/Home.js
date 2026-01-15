import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ArticleCard from "../components/ArticleCard";
import "../styles/layout.css";
import "../styles/home.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const hasRetried = useRef(false);

  const page = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    hasRetried.current = false;
    setLoading(true);

    const fetchArticles = () => {
      fetch(`${API_BASE}/api/articles?page=${page}&limit=10`)
        .then((res) => res.json())
        .then((data) => {
          const items = data.items || [];
          const pages = data.totalPages || 1;

          // Retry once after 5s if empty (cold-start)
          if (items.length === 0 && !hasRetried.current) {
            hasRetried.current = true;
            setTimeout(fetchArticles, 5000);
            return;
          }

          setArticles(items);
          setTotalPages(pages);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setArticles([]);
          setLoading(false);
        });
    };

    fetchArticles();
  }, [page]);

  const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setSearchParams({ page: newPage.toString() });
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="home">
        <Header />
        <div className="loading">Ачаалж байна...</div>
      </div>
    );
  }

  return (
    <div className="home">
      <Header />

      <main className="home-content">
        {articles.length === 0 ? (
          <div className="empty-state">
            <p>Мэдээ олдсонгүй</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article, index) => (
              <ArticleCard
                key={article.fb_post_id}
                article={article}
                featured={index === 0 && page === 1}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="pagination">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="pagination-btn"
            >
              ← Өмнөх
            </button>

            <span className="pagination-info">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="pagination-btn"
            >
              Дараах →
            </button>
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
}
