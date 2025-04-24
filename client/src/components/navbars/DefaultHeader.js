import React from "react";
import { NavLink } from "react-router-dom";
import "../../style/DefaultHeader.css";
import logo from "../../img/Logo.png";
import { ABOUTUS_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, SERVICES_ROUTE } from "../../utils/consts";

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <NavLink to={MAIN_ROUTE}>
          <img src={logo} alt="Logo" className="header-logo" />
        </NavLink>
        <div className="nav-links">
          <NavLink className="services" to={SERVICES_ROUTE}>Послуги</NavLink>
          <NavLink className="about" to={ABOUTUS_ROUTE}>Про нас</NavLink>
          <NavLink to={LOGIN_ROUTE}>
            <button className="login-btn">Увійти</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;