import {BrowserRouter} from "react-router-dom";
import NavBar from "./components/navbars/NavBar";
import DefaultFooter from './components/navbars/DefaultFooter';
import AppRouter from "./components/AppRouter";
import { useContext } from "react";
import { Context } from "./index";
import { observer } from "mobx-react-lite"; 

const App = observer(() => { 
  const { user } = useContext(Context);

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
      {!user.isAuth && <DefaultFooter />} 
    </BrowserRouter>
  );
});

export default App;
