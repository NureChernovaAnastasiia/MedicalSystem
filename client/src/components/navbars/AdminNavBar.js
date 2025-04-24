import React from "react";
import { NavLink } from "react-router-dom";
import "../../style/DefaultHeader.css";
import logo from "../../img/Logo.png";
import {  MAIN_ROUTE,  } from "../../utils/consts";

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <NavLink to={MAIN_ROUTE}>
          <img src={logo} alt="Logo" className="header-logo" />
        </NavLink>
        <div className="nav-links">
          
        </div>
      </div>
    </div>
  );
};

export default Header;