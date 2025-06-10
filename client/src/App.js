import { BrowserRouter } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";

import NavBar from "./components/navbars/NavBar";
import DefaultFooter from "./components/navbars/DefaultFooter";
import AppRouter from "./components/AppRouter";
import Loader from "./components/elements/Loader";
import "./style/App.css";

const App = observer(() => {
  const { user, ui, hospital } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedHospital = localStorage.getItem("hospital");

    if (storedHospital) {
      try {
        hospital.setHospital(JSON.parse(storedHospital));
      } catch (err) {
        console.error("Помилка при розборі hospital з localStorage", err);
      }
    }

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
  }, [user, hospital]);

  if (loading) {
    return <Loader />;
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
