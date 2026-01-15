import { Link } from "react-router-dom";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-about">
            <Link to="/" className="footer-logo">
              <h3>MKOR News</h3>
            </Link>
            <p className="footer-description">
              Солонгос дахь Монголчуудын албан ёсны эх сурвалжтай мэдээ мэдээллийн нэгдсэн төв сүлжээ.
            </p>
          </div>

          <div className="footer-contact">
            <h4 className="footer-heading">Холбоо барих</h4>
            <ul className="footer-contact-list">
              <li>
                <a href="mailto:info@mkor.mn">info@mkor.mn</a>
              </li>
              <li>
                <a href="tel:010-4181-7096">010-4181-7096</a>
              </li>
              <li>
                <a href="tel:976-9665-0493">976-9665-0493</a>
              </li>
            </ul>
          </div>

          <div className="footer-links">
            <h4 className="footer-heading">Холбоосууд</h4>
            <ul className="footer-nav-list">
              <li><Link to="/">Эхлэл</Link></li>
              <li><Link to="/">Мэдээ, мэдээлэл</Link></li>
              <li><Link to="/contact">Холбогдох</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} MKOR News. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}
