import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/default/LogIn.css';
import logo from "../../img/Logo.png";
import { iconUnlock, iconLock } from '../../utils/icons';
import { Context } from "../../index";
import { login, check } from '../../http/userAPI';
import { ADMIN_PANEL_ROUTE, DOCTOR_PANEL_ROUTE, MAIN_ROUTE, PATIENT_PANEL_ROUTE } from '../../utils/consts';
import AlertPopup from '../../components/elements/AlertPopup';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null); 
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const validateEmailOrPhone = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,14}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const newErrors = {};

    if (!email) {
      newErrors.email = 'Це поле є обов’язковим';
    } else if (!validateEmailOrPhone(email)) {
      newErrors.email = 'Невірний формат email або номеру телефону';
    }

    if (!password) {
      newErrors.password = 'Це поле є обов’язковим';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await login(email, password);
        const userData = await check();
        const role = userData.role;

        user.setUser(userData);
        user.setIsAuth(true);
        user.setRole(role);

        let redirectPath = MAIN_ROUTE;
        if (role === "Admin") redirectPath = ADMIN_PANEL_ROUTE;
        else if (role === "Patient") redirectPath = PATIENT_PANEL_ROUTE;
        else if (role === "Doctor") redirectPath = DOCTOR_PANEL_ROUTE;

        localStorage.setItem("token", localStorage.getItem("token")); 
        localStorage.setItem("role", role);

        navigate(redirectPath);
      } catch (e) {
        setAlert({ message: e.message, type: 'error' });
      }
    }
  };

  return (
    <div className="login-container">
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="login-left">
        <div className="login-left-content">
          <img src={logo} alt="LifeLine Logo" className="login-logo" />
          <h2 className="login-title">Вхід у LifeLine</h2>
          <p className="login-description">
            Авторизуйтесь, щоб отримати доступ до ваших медичних даних та записів.
          </p>
          <p className="login-note">
            * Якщо ви ще не зареєстровані в системі, зверніться до вашого лікаря для створення акаунту.
          </p>
        </div>
      </div>

      <form className="login-right" onSubmit={handleSubmit}>
        <label className="login-label">E-mail</label>
        <input
          type="text"
          className={`login-input ${errors.email ? 'input-error' : ''}`}
          placeholder="Введіть ваш e-mail/номер телефону"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}

        <label className="login-label">Пароль</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            className={`login-input ${errors.password ? 'input-error' : ''}`}
            placeholder="Введіть ваш пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <img
              src={showPassword ? iconLock : iconUnlock}
              alt="Toggle visibility"
              className="password-icon"
            />
          </span>
        </div>
        {errors.password && <span className="error-text">{errors.password}</span>}

        <button className="login-button" type="submit">
          Увійти в систему
        </button>
      </form>
    </div>
  );
};

export default LogIn;
