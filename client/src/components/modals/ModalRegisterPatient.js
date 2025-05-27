import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import styles from '../../style/modalstyle/ModalRegisterPatient.module.css';
import { DOCTOR_FILLPATDATA_ROUTE } from '../../utils/consts';
import { registerPatient } from '../../http/userAPI';
import AlertPopup from '../../components/elements/AlertPopup';

const ModalRegisterPatient = ({ doctor, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    hospital_id: doctor.hospital_id,
    doctor_id: doctor.id,
    role: 'Patient',
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [registeredUserId, setRegisteredUserId] = useState(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Це поле є обов’язковим';
    if (!formData.email.trim()) newErrors.email = 'Це поле є обов’язковим';
    else if (!validateEmail(formData.email)) newErrors.email = 'Невірний формат email';
    if (!formData.password.trim()) newErrors.password = 'Це поле є обов’язковим';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const createdUser = await registerPatient(formData);
      const userData = jwtDecode(createdUser.token);

      setAlert({ message: 'Пацієнта успішно зареєстровано', type: 'success' });
      setRegisteredUserId(userData.id);
    } catch (error) {
      console.error('Помилка при реєстрації пацієнта:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Не вдалося зареєструвати пацієнта. Спробуйте ще раз.';
      setAlert({ message: errorMessage, type: 'error' });
    }
  };

  useEffect(() => {
    if (registeredUserId) {
      const timer = setTimeout(() => {
        navigate(`${DOCTOR_FILLPATDATA_ROUTE}/${registeredUserId}`, {
          state: { userType: 'user' },
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [registeredUserId, navigate]);

  return (
    <div className={styles.overlay}>
      {alert && (
        <AlertPopup message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>Реєстрація пацієнта</h2>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label>
            ПІБ:
            <input
              type="text"
              name="username"
              placeholder="Введіть ПІБ пацієнта"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <span className={styles.errorText}>{errors.username}</span>}
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              placeholder="Введіть email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </label>

          <label>
            Пароль:
            <input
              type="password"
              name="password"
              placeholder="Введіть пароль"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
            <button type="submit" className={styles.submitButton}>
              Зареєструвати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegisterPatient;
