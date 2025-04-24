import React, { useState } from 'react';
import '../../style/LogIn.css';
import logo from "../../img/Logo.png";
import unlockIcon from "../../img/icons/unlock.png";       
import lockIcon from "../../img/icons/lock.png"; 

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmailOrPhone = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,14}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSubmit = () => {
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
      console.log("Логін успішний:", { email, password });
    }
  };

  return (
    <div className="login-container">
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

      <div className="login-right">
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
              src={showPassword ? lockIcon : unlockIcon}
              alt="Toggle visibility"
              className="password-icon"
            />
          </span>
        </div>
        {errors.password && <span className="error-text">{errors.password}</span>}

        <button className="login-button" onClick={handleSubmit}>
          Увійти в систему
        </button>
      </div>
    </div>
  );
};

export default LogIn;
