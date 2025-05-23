import { BrowserRouter } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";

import NavBar from "./components/navbars/NavBar";
import DefaultFooter from "./components/navbars/DefaultFooter";
import AppRouter from "./components/AppRouter";
import "./style/Loader.css";
import "./style/App.css";

const App = observer(() => {
  const { user, ui } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      check()
        .then(data => {
          user.setUser(data);
          user.setIsAuth(true);
          user.setRole(data.role);
        })
        .catch(() => user.setIsAuth(false))
        .finally(() => setLoading(false));
    } else {
      user.setIsAuth(false);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={`main-content ${user.isAuth ? (ui.isSidebarOpen ? "sidebar-open" : "sidebar-closed") : ""}`}>
        <NavBar />
        <AppRouter />
        {!user.isAuth && <DefaultFooter />}
      </div>
    </BrowserRouter>
  );
});

export default App;
