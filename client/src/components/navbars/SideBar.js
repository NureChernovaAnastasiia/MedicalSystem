import React from "react";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { Context } from "../../index";
import "../../style/Sidebar.css";

import logo from "../../img/Logo.png";
import avatar from '../../img/icons/people.png';  
import logoutIcon from '../../img/icons/exit.png';

import { DOCTOR_APPOINTMENTS_ROUTE, DOCTOR_HOSPITALDETAILS_ROUTE, DOCTOR_PANEL_ROUTE, DOCTOR_PATIENTS_ROUTE, DOCTOR_SERVICES_ROUTE, PATIENT_ANALYSIS_ROUTE, PATIENT_APPOINTMENTS_ROUTE, PATIENT_DOCAPPOINTMENT_ROUTE, PATIENT_HOSPITALDETAIL_ROUTE, PATIENT_MEDCARD_ROUTE, PATIENT_PANEL_ROUTE, PATIENT_SERVICE_ROUTE } from "../../utils/consts";

const Sidebar = ({ userRole, fullName }) => {
  const { user, ui } = useContext(Context);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    switch (userRole) {
      case "Admin":
        navigate("/admin/dashboard"); 
        break;
      case "Doctor":
        navigate(DOCTOR_PANEL_ROUTE); 
        break;
      case "Patient":
        navigate(PATIENT_PANEL_ROUTE); 
        break;
      default: 
    }
  };

  const menuItems = {
    Admin: [],
    Doctor: [
      { label: 'Пацієнти', path: DOCTOR_PATIENTS_ROUTE },
      { label: 'Прийоми', path: DOCTOR_APPOINTMENTS_ROUTE },
      { label: 'Послуги', path: DOCTOR_SERVICES_ROUTE },
      { label: 'Моя лікарня', path: DOCTOR_HOSPITALDETAILS_ROUTE },
    ],
    Patient: [
      { label: 'Запис до лікаря', path: PATIENT_DOCAPPOINTMENT_ROUTE },
      { label: 'Мої прийоми', path: PATIENT_APPOINTMENTS_ROUTE },
      { label: 'Аналізи', path: PATIENT_ANALYSIS_ROUTE },
      { label: 'Послуги', path: PATIENT_SERVICE_ROUTE },
      { label: 'Медична картка', path: PATIENT_MEDCARD_ROUTE },
      { label: 'Моя лікарня', path: PATIENT_HOSPITALDETAIL_ROUTE },
    ],
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    user.setIsAuth(false);
    user.setUser({});
    user.setRole("");
  };

  const handleSidebarToggle = () => {
    ui.setIsSidebarOpen(!ui.isSidebarOpen); 
  };

  return (
    <aside className={`sidebar ${ui.isSidebarOpen ? "open" : "closed"}`}>
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

      <div className="sidebar_toggle" onClick={handleSidebarToggle}>
        {ui.isSidebarOpen ? (
          <span className="close-icon">↩︎</span> 
        ) : (
          <span className="open-icon">↪︎</span> 
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
