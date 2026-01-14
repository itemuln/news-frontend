import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!article) {
    return (
      <div className="not-found">
        <h1>Article not found</h1>
        <Link to="/">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="article-page">
      <header className="site-header">
        <Link to="/">
          <h1>MKOR News</h1>
        </Link>
      </header>

      <main className="article-detail">
        <article>
          <h1 className="article-title">{article.headline}</h1>
          
          <time className="article-date">
            {new Date(article.published_at).toLocaleString("mn-MN")}
          </time>

          {article.image_url && (
            <div className="article-hero">
              <img src={article.image_url} alt="" />
            </div>
          )}

          <div className="article-body">
            {article.body}
          </div>

          <footer className="article-footer">
            <a 
              href={article.source_url} 
              target="_blank" 
              rel="noreferrer"
              className="source-link"
            >
              View original on Facebook
            </a>
          </footer>
        </article>

        <nav className="back-nav">
          <Link to="/">← Back to all news</Link>
        </nav>
      </main>
    </div>
  );
}
