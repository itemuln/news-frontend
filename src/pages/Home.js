import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import FeaturedNews from "../components/FeaturedNews";
import ArticleList from "../components/ArticleList";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
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

  // Split articles: first 3 for featured, rest for list
  const featuredArticles = page === 1 ? articles.slice(0, 3) : [];
  const listArticles = page === 1 ? articles.slice(3) : articles;

  if (loading) {
    return (
      <div className="home">
        <TopBar />
        <Header />
        <div className="loading">Ачаалж байна...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home">
      <TopBar />
      <Header />

      <div className="home-content">
        <main className="home-main">
          {articles.length === 0 ? (
            <div className="empty-state">
              <p>Мэдээ олдсонгүй</p>
            </div>
          ) : (
            <>
              {/* Featured section only on page 1 */}
              {page === 1 && featuredArticles.length > 0 && (
                <FeaturedNews articles={featuredArticles} />
              )}

              {/* Article list */}
              {listArticles.length > 0 && (
                <ArticleList articles={listArticles} />
              )}
            </>
          )}

          {/* Pagination */}
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

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
