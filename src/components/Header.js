import { Link } from "react-router-dom";
import "../styles/layout.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>MKOR News</h1>
          <span className="header-tagline">Солонгос хөтөч</span>
        </Link>
      </div>
    </header>
  );
}
