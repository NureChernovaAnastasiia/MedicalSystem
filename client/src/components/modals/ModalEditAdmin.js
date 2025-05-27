import React, { useState, useEffect } from 'react';
import { updateHospitalStaffData } from '../../http/hospitalStaffAPI'; 
import styles from '../../style/modalstyle/ModalRegisterPatient.module.css';

const ModalEditAdmin = ({ admin, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: '',
    email: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) {
      setFormData({
        first_name: admin.first_name ?? '',
        last_name: admin.last_name ?? '',
        middle_name: admin.middle_name ?? '',
        phone: admin.phone ?? '',
        email: admin.email ?? '',
      });
      setError(null);
    }
  }, [admin]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updateHospitalStaffData(admin.id, formData);
      setLoading(false);
      onSave?.(formData);
      onClose();
    } catch (err) {
      setLoading(false);
      setError('Помилка при оновленні даних. Спробуйте ще раз.');
      console.error(err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>Редагування даних адміністратора</h2>
        </header>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {[
            { label: "Ім'я", name: "first_name", type: "text", required: true },
            { label: "Прізвище", name: "last_name", type: "text" },
            { label: "По батькові", name: "middle_name", type: "text" },
            { label: "Телефон", name: "phone", type: "tel" },
            { label: "Email", name: "email", type: "email", required: true },
          ].map(({ label, name, type, required }) => (
            <label key={name}>
              {label}:
              <input
                type={type}
                name={name}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
                required={required}
              />
            </label>
          ))}

          {error && <div className={styles.errorText}>{error}</div>}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditAdmin;

