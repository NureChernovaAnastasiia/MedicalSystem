import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from '../index';

import { adminRoutes, doctorRoutes, patientRoutes, publicRoutes } from '../routes';
import { ADMIN_PANEL_ROUTE, DOCTOR_PANEL_ROUTE, MAIN_ROUTE, PATIENT_PANEL_ROUTE } from '../utils/consts';

const AppRouter = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user.isAuth && user.role) {
      if (location.pathname === "/") { 
        if (user.role === "Admin") navigate(ADMIN_PANEL_ROUTE, { replace: true });
        else if (user.role === "Doctor") navigate(DOCTOR_PANEL_ROUTE, { replace: true });
        else if (user.role === "Patient") navigate(PATIENT_PANEL_ROUTE, { replace: true });
      }
    }
  }, [user.isAuth, user.role, navigate, location.pathname]);

  const renderPrivateRoutes = () => {
    switch (user.role) {
      case 'Admin': return adminRoutes;
      case 'Doctor': return doctorRoutes;
      case 'Patient': return patientRoutes;
      default: return [];
    }
  };

  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {user.isAuth && user.role && renderPrivateRoutes().map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      <Route path="*" element={<Navigate to={MAIN_ROUTE} replace />} />
    </Routes>
  );
});

export default AppRouter;