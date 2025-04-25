import React, { useContext } from "react";
import { Context } from "../../index";
import SideBar from "../navbars/SideBar";
import DefaultHeader from "../navbars/DefaultHeader";

const NavBar = () => {
  const { user } = useContext(Context);

  if (user.isAuth) {
    return <SideBar userRole={user.role} fullName={user.user.fullName} />;
  }

  return <DefaultHeader />;
};

export default NavBar;
