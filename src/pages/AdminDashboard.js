import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Admin.css";

const API = process.env.REACT_APP_API_BASE || "";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Banner modal state
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [banners, setBanners] = useState([]);
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLinkUrl, setBannerLinkUrl] = useState("");
  const [bannerUploading, setBannerUploading] = useState(false);

  const token = localStorage.getItem("adminToken");
  const adminUser = localStorage.getItem("adminUser");

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/articles?page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin");
        return;
      }

      const data = await res.json();
      setArticles(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Мэдээ ачаалахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }, [page, token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchArticles();
  }, [token, navigate, fetchArticles]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin");
  };

  const handleDelete = async (id, headline) => {
    if (!window.confirm(`"${headline}" мэдээг устгах уу?`)) return;

    try {
      const res = await fetch(`${API}/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");
      fetchArticles();
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  const handleToggleFeatured = async (article) => {
    try {
      const res = await fetch(`${API}/api/admin/articles/${article.id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_featured: !article.is_featured,
          featured_position: article.featured_position || 0,
        }),
      });

      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      alert("Алдаа гарлаа");
    }
  };

  const handleToggleVisibility = async (article) => {
    try {
      const res = await fetch(`${API}/api/admin/articles/${article.id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_hidden: !article.is_hidden }),
      });

      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      alert("Алдаа гарлаа");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fetch banners
  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/banners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Banner functions - Standalone banners (just images, not tied to articles)
  const handleAddBannerByUrl = async () => {
    if (!bannerUrl.trim()) {
      alert("Зургийн URL оруулна уу");
      return;
    }

    setBannerUploading(true);
    try {
      const res = await fetch(`${API}/api/admin/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: bannerUrl,
          title: bannerTitle || null,
          link_url: bannerLinkUrl || null,
          position: banners.length,
        }),
      });

      if (!res.ok) throw new Error("Failed to add banner");

      alert("Banner амжилттай нэмэгдлээ!");
      setShowBannerModal(false);
      setBannerUrl("");
      setBannerTitle("");
      setBannerLinkUrl("");
      fetchBanners();
    } catch (err) {
      alert("Banner нэмэхэд алдаа гарлаа");
    } finally {
      setBannerUploading(false);
    }
  };

  const handleBannerFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", bannerTitle || "");
    formData.append("link_url", bannerLinkUrl || "");
    formData.append("position", banners.length);

    setBannerUploading(true);
    try {
      const res = await fetch(`${API}/api/admin/banners/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Banner амжилттай нэмэгдлээ!");
      setShowBannerModal(false);
      setBannerUrl("");
      setBannerTitle("");
      setBannerLinkUrl("");
      fetchBanners();
    } catch (err) {
      alert("Banner оруулахад алдаа гарлаа");
    } finally {
      setBannerUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Энэ banner-ыг устгах уу?")) return;

    try {
      const res = await fetch(`${API}/api/admin/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchBanners();
      }
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  const handleToggleBannerActive = async (banner) => {
    try {
      await fetch(`${API}/api/admin/banners/${banner.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !banner.is_active }),
      });
      fetchBanners();
    } catch (err) {
      alert("Алдаа гарлаа");
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Админ хэсэг</h1>
        <div className="admin-header-right">
          <span>Сайн байна уу, {adminUser}</span>
          <button onClick={handleLogout} className="admin-btn secondary">
            Гарах
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <Link to="/admin/articles/new" className="admin-btn primary">
          + Шинэ мэдээ
        </Link>
        <button 
          onClick={() => setShowBannerModal(true)} 
          className="admin-btn banner-btn"
        >
          🖼️ Banner удирдах
        </button>
        <Link to="/" className="admin-btn secondary">
          ← Сайт руу буцах
        </Link>
      </div>

      {/* Banner Modal - Standalone banners */}
      {showBannerModal && (
        <div className="modal-overlay" onClick={() => setShowBannerModal(false)}>
          <div className="modal-content banner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🖼️ Banner удирдлага</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowBannerModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {/* Existing Banners */}
              {banners.length > 0 && (
                <div className="banner-list">
                  <label>Одоогийн banner-ууд:</label>
                  {banners.map((banner) => (
                    <div key={banner.id} className={`banner-list-item ${!banner.is_active ? 'inactive' : ''}`}>
                      <img src={banner.url} alt={banner.title || 'Banner'} />
                      <div className="banner-list-info">
                        <span>{banner.title || 'Гарчиггүй'}</span>
                      </div>
                      <div className="banner-list-actions">
                        <button
                          onClick={() => handleToggleBannerActive(banner)}
                          className={`admin-btn small ${banner.is_active ? '' : 'warning'}`}
                          title={banner.is_active ? 'Идэвхгүй болгох' : 'Идэвхжүүлэх'}
                        >
                          {banner.is_active ? '👁️' : '🙈'}
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="admin-btn small danger"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-divider">
                <span>Шинэ banner нэмэх</span>
              </div>

              {/* Optional Title */}
              <div className="form-group">
                <label>Гарчиг (заавал биш)</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="Banner-ын гарчиг"
                />
              </div>

              {/* Optional Link URL */}
              <div className="form-group">
                <label>Холбоос URL (заавал биш)</label>
                <input
                  type="url"
                  value={bannerLinkUrl}
                  onChange={(e) => setBannerLinkUrl(e.target.value)}
                  placeholder="https://example.com/page"
                />
              </div>

              {/* Upload File */}
              <div className="form-group">
                <label>📁 Файлаас оруулах</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerFileUpload(e.target.files[0])}
                  disabled={bannerUploading}
                />
              </div>

              <div className="modal-divider">
                <span>эсвэл</span>
              </div>

              {/* URL Input */}
              <div className="form-group">
                <label>🔗 URL хаягаар нэмэх</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={bannerUploading}
                />
              </div>

              <button
                onClick={handleAddBannerByUrl}
                disabled={!bannerUrl.trim() || bannerUploading}
                className="admin-btn primary large"
                style={{ width: "100%" }}
              >
                {bannerUploading ? "Оруулж байна..." : "URL-ээр нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Ачааллаж байна...</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Гарчиг</th>
                <th>Эх сурвалж</th>
                <th>Огноо</th>
                <th>Төлөв</th>
                <th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className={article.is_hidden ? "hidden-row" : ""}>
                  <td className="article-headline">
                    {article.headline?.slice(0, 50)}
                    {article.headline?.length > 50 ? "..." : ""}
                  </td>
                  <td>
                    <span className={`source-badge ${article.source || "facebook"}`}>
                      {article.source === "admin" ? "Админ" : "Facebook"}
                    </span>
                  </td>
                  <td>{formatDate(article.published_at)}</td>
                  <td className="status-cell">
                    {article.is_featured && <span className="status-badge featured">⭐ Онцлох</span>}
                    {article.is_hidden && <span className="status-badge hidden">🙈 Нуусан</span>}
                    {article.is_modified && <span className="status-badge modified">✏️</span>}
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleToggleFeatured(article)}
                      className={`admin-btn small ${article.is_featured ? "warning" : ""}`}
                      title={article.is_featured ? "Онцлохоос хасах" : "Онцлох болгох"}
                    >
                      {article.is_featured ? "⭐" : "☆"}
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(article)}
                      className={`admin-btn small ${article.is_hidden ? "warning" : ""}`}
                      title={article.is_hidden ? "Харуулах" : "Нуух"}
                    >
                      {article.is_hidden ? "👁️" : "🙈"}
                    </button>
                    <Link
                      to={`/admin/articles/${article.id}/edit`}
                      className="admin-btn small"
                    >
                      Засах
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, article.headline)}
                      className="admin-btn small danger"
                    >
                      Устгах
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="admin-btn small"
              >
                ← Өмнөх
              </button>
              <span>
                Хуудас {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="admin-btn small"
              >
                Дараах →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
