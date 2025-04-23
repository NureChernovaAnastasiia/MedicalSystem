import React from "react";
import "../../style/DefaultHeader.css";
import logo from "../../img/Logo.png"; 

const Header = () => {
    return (
      <div className="header">
        <div className="header-content">
            <a href="/">
                <img src={logo} alt="Logo" className="logo" />
            </a>
            <div className="nav-links">
                <a href="services" className="services">Послуги</a>
                <a href="about" className="about">Про нас</a>
            <button className="login-button">
                Увійти
            </button>
            </div>
        </div>
      </div>
    );
  };
  
  export default Header;