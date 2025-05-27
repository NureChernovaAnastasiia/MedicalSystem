import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import User from './store/UserStore';
import UIStore from "./store/UIStore"; 
import Hospital from './store/HospitalStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Context.Provider value={{ 
      user: new User(),
      ui: new UIStore(),
      hospital: new Hospital(),
    }}>
      <App />
    </Context.Provider>
  </React.StrictMode>
);