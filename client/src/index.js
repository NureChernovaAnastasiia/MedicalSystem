import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import User from './store/UserStore';
import UIStore from "./store/UIStore"; 

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{ 
      user: new User(),
      ui: new UIStore(),
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);