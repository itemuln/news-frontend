import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/featured.css";

export default function FeaturedNews({ articles }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Only use articles with images for the carousel (limit to 5)
  const carouselArticles = articles.filter(a => a.image_url).slice(0, 5);
  const totalSlides = carouselArticles.length;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  if (!articles || articles.length === 0) return null;

  return (
    <section className="featured">
      <div className="featured-container">
        {/* Carousel/Slider */}
        <div 
          className="featured-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselArticles.map((article, index) => (
              <article 
                key={article.fb_post_id} 
                className="carousel-slide"
                aria-hidden={index !== currentSlide}
              >
                <Link to={`/article/${article.fb_post_id}`} className="carousel-link">
                  <div className="carousel-image">
                    <img 
                      src={article.image_url} 
                      alt="" 
                      loading={index === 0 ? "eager" : "lazy"} 
                    />
                  </div>
                  <div className="carousel-content">
                    <h2 className="carousel-title">{article.headline}</h2>
                    <time className="carousel-date">{formatDate(article.published_at)}</time>
                    <span className="carousel-btn">Дэлгэрэнгүй</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button 
                className="carousel-arrow carousel-prev" 
                onClick={prevSlide}
                aria-label="Өмнөх мэдээ"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button 
                className="carousel-arrow carousel-next" 
                onClick={nextSlide}
                aria-label="Дараагийн мэдээ"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {totalSlides > 1 && (
            <div className="carousel-dots">
              {carouselArticles.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Мэдээ ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
