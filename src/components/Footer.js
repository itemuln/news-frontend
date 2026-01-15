import "../styles/layout.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">© {new Date().getFullYear()} MKOR News</p>
        <p className="footer-subtext">Солонгос хөтөч</p>
      </div>
    </footer>
  );
}
