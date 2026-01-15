import { Link, useLocation } from "react-router-dom";
import "../styles/nav.css";

export default function Nav() {
  const location = useLocation();

  const navItems = [
    { label: "Эхлэл", path: "/" },
    { label: "Мэдээ, мэдээлэл", path: "/" },
    { label: "Холбогдох", path: "/contact" },
  ];

  return (
    <nav className="nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.label} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
