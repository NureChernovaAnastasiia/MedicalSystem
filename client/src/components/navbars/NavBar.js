import React, { useContext } from "react";
import { Context } from "../../index";
import AdminNavBar from "../navbars/AdminNavBar";
import PatientNavBar from "../navbars/PatientNavBar";
import DefaultHeader from "../navbars/DefaultHeader"; // Если не авторизован

const NavBar = () => {
  const { user } = useContext(Context);

  if (user.isAuth) {
    if (user.role === "admin") {
      return <AdminNavBar />;
    }
    if (user.role === "patient") {
      return <PatientNavBar />;
    }
    // Добавьте для медперсонала
  }
  return <DefaultHeader />;
};

export default NavBar;
