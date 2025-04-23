import React from "react";
import "../../style/DefaultFooter.css";
import logo from "../../img/Logo.png";

const DefaultFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>

        <div className="footer-section">
          <h3>Сервіс</h3>
          <ul>
            <li><a href="/services">Послуги</a></li>
            <li><a href="/about">Про нас</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Контакти</h3>
          <ul>
            <li><a href="mailto:support@lifeline.com" className="email">
                Електронна пошта support@lifeline.com</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Оновлення та новини</h3>
          <div className="social-icons">
            <a href="https://t.me" target="_blank" rel="noopener noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png"
                alt="Telegram Icon"
              />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
                alt="Instagram Icon"
              />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                alt="Facebook Icon"
              />
            </a>
          </div>
          <p className="copyright">© 2025 LifeLine. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
};

export default DefaultFooter;
