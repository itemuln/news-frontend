import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopBar from "../components/TopBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/layout.css";
import "../styles/article.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000";

export default function Article() {
  const { fbPostId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/articles/by-fb/${fbPostId}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [fbPostId]);

  if (loading) {
    return (
      <div className="article-page">
        <TopBar />
        <Header />
        <div className="loading">Ачаалж байна...</div>
        <Footer />
      </div>
    );
  }

  if (!article || article.error) {
    return (
      <div className="article-page">
        <TopBar />
        <Header />
        <div className="not-found">
          <h1>Мэдээ олдсонгүй</h1>
          <Link to="/">← Нүүр хуудас руу буцах</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="article-page">
      <TopBar />
      <Header />

      <main className="article-main">
        <article className="article-content">
          <header className="article-header">
            <Link to="/" className="back-to-home">← Нүүр хуудас</Link>
            <h1 className="article-title">{article.headline}</h1>
            <div className="article-meta">
              <time className="article-date">
                {new Date(article.published_at).toLocaleDateString("mn-MN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </time>
            </div>
          </header>

          {article.image_url && (
            <figure className="article-hero">
              <img src={article.image_url} alt="" />
            </figure>
          )}

          <div className="article-body">
            {article.body.split('\n').map((paragraph, idx) => (
              paragraph.trim() && <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <footer className="article-footer">
            <a
              href={article.source_url}
              target="_blank"
              rel="noreferrer"
              className="source-link"
            >
              <span className="fb-icon">f</span>
              Facebook дээр үзэх
            </a>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}
