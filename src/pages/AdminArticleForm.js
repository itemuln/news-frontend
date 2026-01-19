import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./Admin.css";

const API = process.env.REACT_APP_API_BASE || "";

export default function AdminArticleForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredPosition, setFeaturedPosition] = useState(0);
  const [bannerMediaId, setBannerMediaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Media management
  const [media, setMedia] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const token = localStorage.getItem("adminToken");

  // Fetch article data
  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }

    if (isEdit) {
      fetch(`${API}/api/articles/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setHeadline(data.headline || "");
          setBody(data.body || "");
          setImageUrl(data.image_url || "");
          setIsFeatured(data.is_featured || false);
          setFeaturedPosition(data.featured_position || 0);
          setBannerMediaId(data.banner_media_id || null);
          setMedia(data.media || []);
        })
        .catch(() => setError("Мэдээ ачаалахад алдаа гарлаа"));
    }
  }, [id, isEdit, token, navigate]);

  // Fetch media for article
  const fetchMedia = useCallback(async () => {
    if (!isEdit) return;
    setMediaLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/articles/${id}/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setMediaLoading(false);
    }
  }, [id, isEdit, token]);

  useEffect(() => {
    if (isEdit && token) {
      fetchMedia();
    }
  }, [isEdit, token, fetchMedia]);

  // Save article
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isEdit
      ? `${API}/api/admin/articles/${id}`
      : `${API}/api/admin/articles`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          headline,
          body,
          image_url: imageUrl || null,
          is_featured: isFeatured,
          featured_position: featuredPosition,
          banner_media_id: bannerMediaId,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add media by URL
  const handleAddMediaUrl = async () => {
    if (!newMediaUrl.trim() || !isEdit) return;

    setMediaLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/articles/${id}/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: newMediaUrl,
          media_type: newMediaUrl.match(/\.(mp4|webm)$/i) ? "video" : "image",
          position: media.length,
        }),
      });

      if (res.ok) {
        const newMedia = await res.json();
        setMedia([...media, newMedia]);
        setNewMediaUrl("");
      } else {
        throw new Error("Failed to add media");
      }
    } catch (err) {
      alert("Медиа нэмэхэд алдаа гарлаа");
    } finally {
      setMediaLoading(false);
    }
  };

  // Upload file
  const handleFileUpload = async (file) => {
    if (!isEdit || !file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", media.length);

    setUploadProgress(true);
    try {
      const res = await fetch(`${API}/api/admin/articles/${id}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const newMedia = await res.json();
        setMedia([...media, newMedia]);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      alert(`Файл оруулахад алдаа: ${err.message}`);
    } finally {
      setUploadProgress(false);
    }
  };

  // Delete media
  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm("Энэ медиаг устгах уу?")) return;

    try {
      const res = await fetch(`${API}/api/admin/media/${mediaId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setMedia(media.filter((m) => m.id !== mediaId));
        if (bannerMediaId === mediaId) {
          setBannerMediaId(null);
        }
      }
    } catch (err) {
      alert("Устгахад алдаа гарлаа");
    }
  };

  // Set as banner
  const handleSetBanner = async (mediaId) => {
    try {
      const res = await fetch(`${API}/api/admin/articles/${id}/banner`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ banner_media_id: mediaId }),
      });

      if (res.ok) {
        setBannerMediaId(mediaId);
      }
    } catch (err) {
      alert("Banner тохируулахад алдаа гарлаа");
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="admin-form-container">
      <div className="admin-form-header">
        <h1>{isEdit ? "Мэдээ засах" : "Шинэ мэдээ"}</h1>
        <Link to="/admin/dashboard" className="admin-btn secondary">
          ← Буцах
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-article-form">
        <div className="form-group">
          <label>Гарчиг *</label>
          <input
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            required
            placeholder="Мэдээний гарчиг"
          />
        </div>

        <div className="form-group">
          <label>Үндсэн зургийн URL (хуучин)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && (
            <div className="image-preview">
              <img src={imageUrl} alt="Preview" />
            </div>
          )}
        </div>

        {/* Featured Toggle */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <span>Онцлох мэдээ (Carousel-д харуулах)</span>
          </label>
          {isFeatured && (
            <div className="featured-position">
              <label>Байршил (0 = эхэнд):</label>
              <input
                type="number"
                value={featuredPosition}
                onChange={(e) => setFeaturedPosition(parseInt(e.target.value) || 0)}
                min="0"
                style={{ width: "80px" }}
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Агуулга</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={15}
            placeholder="Мэдээний дэлгэрэнгүй..."
          />
        </div>

        {/* Media Management Section - Only for Edit mode */}
        {isEdit && (
          <div className="media-section">
            <h3>📷 Зураг / Видео удирдлага</h3>

            {/* Banner Selection Dropdown */}
            {media.length > 0 && (
              <div className="banner-selector">
                <label>🖼️ Banner зураг сонгох:</label>
                <select
                  value={bannerMediaId || ""}
                  onChange={(e) => handleSetBanner(e.target.value || null)}
                >
                  <option value="">-- Banner сонгоогүй --</option>
                  {media.filter(m => m.media_type === "image").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.alt_text || `Зураг ${media.indexOf(item) + 1}`}
                    </option>
                  ))}
                </select>
                {bannerMediaId && (
                  <div className="banner-preview">
                    <img 
                      src={media.find(m => m.id === bannerMediaId)?.url} 
                      alt="Banner preview" 
                    />
                  </div>
                )}
              </div>
            )}

            {/* Upload Area */}
            <div
              className={`upload-area ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadProgress ? (
                <div className="upload-progress">Оруулж байна...</div>
              ) : (
                <>
                  <p>📁 Файлыг чирж оруулна уу эсвэл</p>
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="fileInput" className="admin-btn primary">
                    Файл сонгох
                  </label>
                </>
              )}
            </div>

            {/* URL Input */}
            <div className="media-url-input">
              <input
                type="url"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                placeholder="Зураг/Видео URL оруулах"
              />
              <button
                type="button"
                onClick={handleAddMediaUrl}
                disabled={!newMediaUrl.trim() || mediaLoading}
                className="admin-btn primary"
              >
                + Нэмэх
              </button>
            </div>

            {/* Media List */}
            {media.length > 0 && (
              <div className="media-list">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className={`media-item ${bannerMediaId === item.id ? "is-banner" : ""}`}
                  >
                    <div className="media-preview">
                      {item.media_type === "video" ? (
                        <video src={item.url} muted />
                      ) : (
                        <img src={item.url} alt={item.alt_text || "Media"} />
                      )}
                    </div>
                    <div className="media-info">
                      <span className="media-type">{item.media_type}</span>
                      {bannerMediaId === item.id && (
                        <span className="banner-badge">Banner</span>
                      )}
                    </div>
                    <div className="media-actions">
                      {bannerMediaId !== item.id && (
                        <button
                          type="button"
                          onClick={() => handleSetBanner(item.id)}
                          className="admin-btn small"
                          title="Banner болгох"
                        >
                          🖼️
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMedia(item.id)}
                        className="admin-btn small danger"
                        title="Устгах"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mediaLoading && <div className="media-loading">Ачааллаж байна...</div>}
          </div>
        )}

        {!isEdit && (
          <div className="form-info">
            💡 Зураг/видео нэмэхийн тулд эхлээд мэдээг хадгалаад засварлах хэсэгт орно уу.
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="admin-btn primary large">
            {loading ? "Хадгалж байна..." : isEdit ? "Хадгалах" : "Нийтлэх"}
          </button>
          <Link to="/admin/dashboard" className="admin-btn secondary large">
            Цуцлах
          </Link>
        </div>
      </form>
    </div>
  );
}
