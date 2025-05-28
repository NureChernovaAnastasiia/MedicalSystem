import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import styles from '../../style/modalstyle/ModalRegisterPatient.module.css';
import { ADMIN_EDITPATDATA_ROUTE, DOCTOR_FILLPATDATA_ROUTE } from '../../utils/consts';
import { registerUser } from '../../http/userAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import AlertPopup from '../../components/elements/AlertPopup';
import { Context } from '../../index';

const ModalRegisterPatient = ({ doctor, onClose }) => {
  const navigate = useNavigate();
  const { hospital, user } = useContext(Context);
  const role = user?._role;
  const hospitalId = hospital?.hospitalId;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    hospital_id: doctor?.hospital_id || hospitalId,
    doctor_id: doctor?.id || null,
    role: 'Patient',
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [registeredUserId, setRegisteredUserId] = useState(null);

  const [doctors, setDoctors] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!doctor && hospitalId) {
      fetchDoctorsByHospitalId(hospitalId)
        .then(setDoctors)
        .catch(() => {
          setAlert({ message: 'Не вдалося отримати список лікарів', type: 'error' });
        });
    }
  }, [doctor, hospitalId]);

  useEffect(() => {
    if (searchInput.trim()) {
      const lower = searchInput.toLowerCase();
      setFilteredDoctors(
        doctors.filter((doc) =>
          `${doc.last_name} ${doc.first_name} ${doc.middle_name}`.toLowerCase().includes(lower)
        )
      );
    } else {
      setFilteredDoctors([]);
    }
  }, [searchInput, doctors]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Це поле є обов’язковим';
    if (!formData.email.trim()) newErrors.email = 'Це поле є обов’язковим';
    else if (!validateEmail(formData.email)) newErrors.email = 'Невірний формат email';
    if (!formData.password.trim()) newErrors.password = 'Це поле є обов’язковим';
    if (!formData.doctor_id) newErrors.doctor_id = 'Оберіть лікаря';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectDoctor = (selectedDoctor) => {
    setFormData((prev) => ({
      ...prev,
      doctor_id: selectedDoctor.id,
      hospital_id: selectedDoctor.hospital_id,
    }));
    setSearchInput(`${selectedDoctor.last_name} ${selectedDoctor.first_name} ${selectedDoctor.middle_name}`);
    setFilteredDoctors([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const createdUser = await registerUser(formData);
      const userData = jwtDecode(createdUser.token);
      setAlert({ message: 'Пацієнта успішно зареєстровано', type: 'success' });
      setRegisteredUserId(userData.id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Не вдалося зареєструвати пацієнта. Спробуйте ще раз.';
      setAlert({ message: errorMessage, type: 'error' });
    }
  };

  useEffect(() => {
    if (registeredUserId) {
      const route =
        role === 'Doctor'
          ? `${DOCTOR_FILLPATDATA_ROUTE}/${registeredUserId}`
          : role === 'Admin'
          ? `${ADMIN_EDITPATDATA_ROUTE}/${registeredUserId}`
          : '#';

      const timer = setTimeout(() => {
        navigate(route);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [registeredUserId, navigate, role]);


  const formFields = [
    { label: 'ПІБ', name: 'username', type: 'text', placeholder: 'Введіть ПІБ пацієнта', },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'Введіть email', },
    { label: 'Пароль', name: 'password', type: 'password', placeholder: 'Введіть пароль', },
  ];

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
          {!doctor && (
            <div className={styles.doctorSearch}>
              <label htmlFor="doctorSearch">Оберіть лікаря:</label>
              <input
                type="text"
                id="doctorSearch"
                placeholder="Пошук лікаря..."
                value={searchInput}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              {showSuggestions && filteredDoctors.length > 0 && (
                <ul className={styles.suggestions}>
                  {filteredDoctors.map((doc) => (
                    <li
                      key={doc.id}
                      onClick={() => handleSelectDoctor(doc)}
                      className={styles.suggestionItem}
                    >
                      {`${doc.last_name} ${doc.first_name} ${doc.middle_name}`}
                    </li>
                  ))}
                </ul>
              )}
              {errors.doctor_id && <span className={styles.errorText}>{errors.doctor_id}</span>}
            </div>
          )}

          {formFields.map(({ label, name, type = 'text', placeholder }) => (
            <label key={name}>
              {label}:
              <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && <span className={styles.errorText}>{errors[name]}</span>}
            </label>
          ))}

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
