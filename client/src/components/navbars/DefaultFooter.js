import React from "react";
import { NavLink } from "react-router-dom";
import "../../style/DefaultFooter.css";
import logo from "../../img/Logo.png";
import { ABOUTUS_ROUTE, MAIN_ROUTE, SERVICES_ROUTE } from "../../utils/consts";

const DefaultFooter = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <NavLink to={MAIN_ROUTE}>
            <img src={logo} alt="Logo" />
          </NavLink>
        </div>

        <div className="footer-section">
          <h3>Сервіс</h3>
          <ul>
            <li>
              <NavLink to={SERVICES_ROUTE}>Послуги</NavLink>
            </li>
            <li>
              <NavLink to={ABOUTUS_ROUTE}>Про нас</NavLink>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Контакти</h3>
          <ul>
            <li className="email-label">Електронна пошта</li>
              <a href="mailto:support@lifeline.com" className="email">
                support@lifeline.com
              </a>
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
