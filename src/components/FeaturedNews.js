import { Link } from "react-router-dom";
import "../styles/featured.css";

export default function FeaturedNews({ articles }) {
  if (!articles || articles.length === 0) return null;

  const heroArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="featured">
      <div className="featured-container">
        {/* Hero Article */}
        <article className="featured-hero">
          <Link to={`/article/${heroArticle.fb_post_id}`} className="featured-hero-link">
            {heroArticle.image_url && (
              <div className="featured-hero-image">
                <img src={heroArticle.image_url} alt="" loading="eager" />
              </div>
            )}
            <div className="featured-hero-content">
              <h2 className="featured-hero-title">{heroArticle.headline}</h2>
              <time className="featured-hero-date">{formatDate(heroArticle.published_at)}</time>
              <span className="featured-link-text">Дэлгэрэнгүй →</span>
            </div>
          </Link>
        </article>

        {/* Side Articles */}
        {sideArticles.length > 0 && (
          <div className="featured-side">
            {sideArticles.map((article) => (
              <article key={article.fb_post_id} className="featured-card">
                <Link to={`/article/${article.fb_post_id}`} className="featured-card-link">
                  {article.image_url && (
                    <div className="featured-card-image">
                      <img src={article.image_url} alt="" loading="lazy" />
                    </div>
                  )}
                  <div className="featured-card-content">
                    <h3 className="featured-card-title">{article.headline}</h3>
                    <time className="featured-card-date">{formatDate(article.published_at)}</time>
                    <span className="featured-link-text">Дэлгэрэнгүй →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
