import React, { useContext } from "react";
import { Context } from "../../index";
import AdminNavBar from "../navbars/AdminNavBar";
import PatientNavBar from "../navbars/PatientNavBar";
import DefaultHeader from "../navbars/DefaultHeader"; // Если не авторизован

const NavBar = () => {
  const { user } = useContext(Context);

  if (user.isAuth) {
    if (user.role === "Admin") {
      return <AdminNavBar />;
    }
    if (user.role === "Patient") {
      return <PatientNavBar />;
    }
    // Добавьте для медперсонала
  }
  return <DefaultHeader />;
};

export default NavBar;
