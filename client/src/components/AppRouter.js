import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { adminRoutes, doctorRoutes, patientRoutes, publicRoutes } from '../routes';
import {
  MAIN_ROUTE,
} from '../utils/consts';

const AppRouter = observer(() => {
  const { user } = useContext(Context);

  const renderPrivateRoutes = () => {
    if (user.role === 'Admin') {
      return adminRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ));
    } else if (user.role === 'Doctor') {
      return doctorRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ));
    } else if (user.role === 'Patient') {
      return patientRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ));
    }
    return null;
  };

  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}

      {user.isAuth && renderPrivateRoutes()}

      {/* Перенаправлення за замовчуванням */}
      <Route path="*" element={<Navigate to={MAIN_ROUTE} replace />} />
    </Routes>
  );
});

export default AppRouter;
