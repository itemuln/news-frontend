import SearchBox from "./SearchBox";
import "../styles/sidebar.css";

export default function Sidebar() {
  // Banner images - you can replace these with your actual banner images
  const banners = [
    {
      id: 1,
      image: "/banners/banner1.png",
      alt: "Banner 1",
      link: "#"
    },
    {
      id: 2,
      image: "/banners/banner2.png",
      alt: "Banner 2",
      link: "#"
    },
    {
      id: 3,
      image: "/banners/banner3.png",
      alt: "Banner 3",
      link: "#"
    },
    {
      id: 4,
      image: "/banners/banner4.png",
      alt: "Banner 4",
      link: "#"
    }
  ];

  return (
    <aside className="sidebar">
      {/* Search Box */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Хайлт</h3>
        <SearchBox />
      </div>

      {/* Banners */}
      <div className="sidebar-section">
        <div className="sidebar-banners">
          {banners.map((banner) => (
            <a
              key={banner.id}
              href={banner.link}
              className="sidebar-banner"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={banner.image}
                alt={banner.alt}
                onError={(e) => {
                  // Show placeholder if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('banner-placeholder');
                }}
              />
              <span className="banner-placeholder-text">Banner {banner.id}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Facebook Page Widget placeholder */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">"MKOR" -д нэгдээрэй</h3>
        <div className="sidebar-social">
          <a
            href="https://www.facebook.com/mkormn"
            target="_blank"
            rel="noreferrer"
            className="facebook-follow-btn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}
