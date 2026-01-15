import { Link } from "react-router-dom";
import "../styles/articlelist.css";

export default function ArticleList({ articles }) {
  if (!articles || articles.length === 0) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <section className="article-list">
      <div className="article-list-header">
        <h2 className="article-list-title">Бусад мэдээ</h2>
      </div>
      <div className="article-list-items">
        {articles.map((article) => (
          <article key={article.fb_post_id} className="list-item">
            <div className="list-item-content">
              <Link to={`/article/${article.fb_post_id}`} className="list-item-link">
                <h3 className="list-item-title">{article.headline}</h3>
              </Link>
              {article.body && (
                <p className="list-item-excerpt">{truncateText(article.body)}</p>
              )}
              <div className="list-item-meta">
                <time className="list-item-date">{formatDate(article.published_at)}</time>
                <Link to={`/article/${article.fb_post_id}`} className="list-item-button">
                  Унших
                </Link>
              </div>
            </div>
            {article.image_url && (
              <Link to={`/article/${article.fb_post_id}`} className="list-item-image">
                <img src={article.image_url} alt="" loading="lazy" />
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
