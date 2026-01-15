import { Link } from "react-router-dom";
import Nav from "./Nav";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/logo.png" alt="MKOR News" className="header-logo-img" />
          <div className="header-text">
          </div>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
