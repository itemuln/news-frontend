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

  return (
    <section className="article-list">
      <div className="article-list-header">
        <h2 className="article-list-title">Бусад мэдээ</h2>
      </div>
      <div className="article-list-items">
        {articles.map((article) => (
          <Link 
            key={article.fb_post_id} 
            to={`/article/${article.fb_post_id}`} 
            className="list-item"
          >
            {article.image_url && (
              <div className="list-item-image">
                <img src={article.image_url} alt="" loading="lazy" />
              </div>
            )}
            <div className="list-item-content">
              <h3 className="list-item-title">{article.headline}</h3>
              <time className="list-item-date">{formatDate(article.published_at)}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
