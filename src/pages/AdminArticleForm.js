import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }

    if (isEdit) {
      // Fetch existing article
      fetch(`${API}/api/articles/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setHeadline(data.headline || "");
          setBody(data.body || "");
          setImageUrl(data.image_url || "");
        })
        .catch(() => setError("Мэдээ ачаалахад алдаа гарлаа"));
    }
  }, [id, isEdit, token, navigate]);

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
          <label>Зургийн URL</label>
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

        <div className="form-group">
          <label>Агуулга</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={15}
            placeholder="Мэдээний дэлгэрэнгүй..."
          />
        </div>

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
