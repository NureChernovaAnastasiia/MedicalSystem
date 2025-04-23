import {BrowserRouter} from "react-router-dom";
import NavBar from "./components/navbars/NavBar";
import AppRouter from "./components/AppRouter";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
