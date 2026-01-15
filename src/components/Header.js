import { Link } from "react-router-dom";
import Nav from "./Nav";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1 className="header-title">MKOR News</h1>
          <span className="header-tagline">Солонгос хөтөч</span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
