import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import styles from '../../style/modalstyle/ModalRegistrationDocStaff.module.css';
import { Context } from '../../index';
import { registerUser } from '../../http/userAPI';
import AlertPopup from '../../components/elements/AlertPopup';
import { ADMIN_EDITDOCSTAFFDATA_ROUTE } from '../../utils/consts';

const ModalRegistrationDocStaff = ({ onClose }) => {
  const navigate = useNavigate();
  const { hospital } = useContext(Context);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'Doctor',
    hospital_id: hospital?.hospitalId,
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [registeredUserId, setRegisteredUserId] = useState(null);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Це поле є обов’язковим';
    if (!formData.email.trim()) newErrors.email = 'Це поле є обов’язковим';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Невірний формат email';
    if (!formData.password.trim()) newErrors.password = 'Це поле є обов’язковим';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleTypeChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const createdUser = await registerUser(formData);
      const userData = jwtDecode(createdUser.token);
      setAlert({ message: 'Користувача успішно зареєстровано', type: 'success' });
      setRegisteredUserId(userData.id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Не вдалося зареєструвати користувача. Спробуйте ще раз.';
      setAlert({ message: errorMessage, type: 'error' });
    }
  };

  useEffect(() => {
    if (registeredUserId) {
      const timer = setTimeout(() => {
        navigate(`${ADMIN_EDITDOCSTAFFDATA_ROUTE}/${registeredUserId}`, {
          state: { userType: formData.role },
        });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [registeredUserId, navigate, formData.role]);

  return (
    <div className={styles.overlay}>
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>Реєстрація працівника</h2>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {[
            { label: 'ПІБ:', name: 'username', type: 'text', placeholder: 'Введіть ПІБ', },
            { label: 'Email:', name: 'email', type: 'email', placeholder: 'Введіть email', },
            { label: 'Пароль:', name: 'password', type: 'password', placeholder: 'Введіть пароль', },
          ].map(({ label, name, type, placeholder }) => (
            <label key={name}>
              {label}
              <input type={type} name={name} placeholder={placeholder} value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && <span className={styles.errorText}>{errors[name]}</span>}
            </label>
          ))}

          <label>
            Тип користувача:
            <select value={formData.role} onChange={handleTypeChange} className={styles.select}>
              <option value="Doctor">Лікар</option>
              <option value="Staff">Персонал</option>
            </select>
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

export default ModalRegistrationDocStaff;
