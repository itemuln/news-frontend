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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <Link to="/" className="admin-btn secondary">
          ← Сайт руу буцах
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="admin-loading">Ачааллаж байна...</div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Гарчиг</th>
                <th>Эх сурвалж</th>
                <th>Огноо</th>
                <th>Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.id}</td>
                  <td className="article-headline">
                    {article.headline?.slice(0, 60)}
                    {article.headline?.length > 60 ? "..." : ""}
                  </td>
                  <td>
                    <span className={`source-badge ${article.source || "facebook"}`}>
                      {article.source === "admin" ? "Админ" : "Facebook"}
                    </span>
                  </td>
                  <td>{formatDate(article.published_at)}</td>
                  <td className="actions">
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
