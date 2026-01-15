import { Link } from "react-router-dom";
import "../styles/home.css";

export default function ArticleCard({ article, featured }) {
  const { fb_post_id, headline, image_url, published_at } = article;

  return (
    <article className={`card ${featured ? "featured" : ""}`}>
      <Link to={`/article/${fb_post_id}`} className="card-link">
        {image_url && (
          <div className="card-image">
            <img src={image_url} alt="" loading="lazy" />
          </div>
        )}
        <div className="card-body">
          <h2 className="card-title">{headline}</h2>
          <time className="card-date">
            {new Date(published_at).toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </Link>
    </article>
  );
}
