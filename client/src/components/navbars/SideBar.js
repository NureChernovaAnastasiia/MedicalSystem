import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { Context } from "../../index";
import "../../style/Sidebar.css";

import logo from "../../img/Logo.png";
import avatar from '../../img/icons/people.png';  
import logoutIcon from '../../img/icons/exit.png';

import { PATIENT_MEDCARD_ROUTE, PATIENT_PANEL_ROUTE } from "../../utils/consts";

const Sidebar = ({ userRole, fullName }) => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 

  const handleLogoClick = () => {
    switch (userRole) {
      case "Admin":
        navigate("/admin/dashboard"); 
        break;
      case "Doctor":
        navigate("/doctor/dashboard"); 
        break;
      case "Patient":
        navigate(PATIENT_PANEL_ROUTE); 
        break;
      default: 
    }
  };

  const menuItems = {
    Admin: [],
    Doctor: [],
    Patient: [
      { label: 'Запис до лікаря', path: '/patient/appointments' },
      { label: 'Мої прийоми', path: '/patient/my-visits' },
      { label: 'Аналізи', path: '/patient/analysis' },
      { label: 'Послуги', path: '/patient/analysis' },
      { label: 'Медична картка', path: PATIENT_MEDCARD_ROUTE },
      { label: 'Моя лікарня', path: '/patient/analysis' },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    user.setIsAuth(false);
    user.setUser({});
    user.setRole("");
  };

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar_logo" onClick={handleLogoClick}>
        <img src={logo} alt="Logo" />
      </div>

      <div className="sidebar_profile">
        <img src={avatar} alt="Avatar" className="sidebar_avatar" />
        <div className="sidebar_name">
          {fullName ? fullName : 'Немає даних'}
        </div>
      </div>

      <nav className="sidebar_nav">
        {menuItems[userRole]?.map((item, index) => (
          <div key={index} className="sidebar_item" onClick={() => navigate(item.path)}>
            <div className="sidebar_blur-layer"></div>
            <span className="sidebar_item-text">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar_logout" onClick={handleLogout}>
        <img src={logoutIcon} alt="Logout" className="sidebar_logout-icon" />
        <span>Вийти з профілю</span>
      </div>

      <div className="sidebar_toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? (
          <span className="close-icon">↩︎</span> 
        ) : (
          <span className="open-icon">↪︎</span> 
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
