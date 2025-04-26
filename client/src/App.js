import { BrowserRouter } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import "./style/Loader.css";

import NavBar from "./components/navbars/NavBar";
import DefaultFooter from "./components/navbars/DefaultFooter";
import AppRouter from "./components/AppRouter";

const App = observer(() => {
  const { user } = useContext(Context);
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

  return (
    <BrowserRouter>
      {loading ? (
        <div className="loader-wrapper">
          <div className="loader-spin" />
        </div>
      ) : (
        <>
          <NavBar />
          <AppRouter />
          {!user.isAuth && <DefaultFooter />}
        </>
      )}
    </BrowserRouter>
  );
});

export default App;