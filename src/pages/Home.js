import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      <header className="site-header">
        <h1>MKOR News</h1>
        <p>Солонгос хөтөч</p>
      </header>

      <main className="articles-list">
        {articles.map((a) => (
          <article key={a.fb_post_id} className="article-card">
            <Link to={`/article/${a.fb_post_id}`}>
              {a.image_url && (
                <div className="article-image">
                  <img src={a.image_url} alt="" />
                </div>
              )}
              <div className="article-content">
                <h2>{a.headline}</h2>
                <time>{new Date(a.published_at).toLocaleString("mn-MN")}</time>
              </div>
            </Link>
          </article>
        ))}
      </main>

      {totalPages > 1 && (
        <nav className="pagination">
          <button 
            onClick={() => goToPage(page - 1)} 
            disabled={page <= 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          
          <button 
            onClick={() => goToPage(page + 1)} 
            disabled={page >= totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
