import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes } from "../routes";
import { Context } from "../index";
import { ADMIN_PANEL_ROUTE, PATIENT_PANEL_ROUTE, DOCTOR_PANEL_ROUTE, MAIN_ROUTE } from "../utils/consts";
import AdminPanel from "../pages/adminpanel/AdminPanel"; // Импорт компонента AdminPanel
import PatientPanel from "../pages/patientpanel/PatientPanel"; // Импорт компонента PatientPanel
import DoctorPanel from "../pages/doctorpanel/DoctorPanel"; // Импорт компонента PatientPanel

const AppRouter = () => {
  const { user } = useContext(Context);

  return (
    <Routes>
      {user.isAuth ? (
        // В зависимости от роли, рендерим разные панели
        <>
          {user.role === "admin" && (
            <Route path={ADMIN_PANEL_ROUTE} element={<AdminPanel />} />
          )}
          {user.role === "patient" && (
            <Route path={PATIENT_PANEL_ROUTE} element={<PatientPanel />} />
          )}
          {user.role === "doctor" && (
            <Route path={DOCTOR_PANEL_ROUTE} element={<DoctorPanel />} />
          )}
        </>
      ) : (
        // Публичные маршруты
        publicRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))
      )}
      <Route path="*" element={<Navigate to={MAIN_ROUTE} />} />
    </Routes>
  );
};

export default AppRouter;
