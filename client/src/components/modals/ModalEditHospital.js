import React, { useState } from 'react';
import styles from '../../style/modalstyle/ModalRegisterPatient.module.css';
import { updateHospitalData } from '../../http/hospitalAPI';

const ModalEditHospital = ({ hospital, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: hospital?.name || '',
    address: hospital?.address || '',
    phone: hospital?.phone || '',
    email: hospital?.email || '',
    type: hospital?.type || '',
    working_hours: hospital?.working_hours || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateHospitalData(hospital.id, formData);
      onSave({ ...hospital, ...formData });
      onClose();
    } catch (error) {
      console.error('Помилка при оновленні лікарні', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 className={styles.title}>Редагувати інформацію про лікарню</h2>
        </header>
        <form onSubmit={handleSubmit} className={styles.form}>

          {[
            { label: 'Назва', name: 'name', type: 'text' },
            { label: 'Адреса', name: 'address', type: 'text' },
            { label: 'Телефон', name: 'phone', type: 'tel' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Тип', name: 'type', type: 'text' },
            { label: 'Години роботи', name: 'working_hours', type: 'text' }
          ].map(({ label, name, type }) => (
            <label key={name}>
              {label}:
              <input type={type} name={name}
                value={formData[name]} onChange={handleChange}
                required disabled={loading}
              />
            </label>
          ))}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading} >
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>

            <button type="submit" className={styles.submitButton} disabled={loading} >
              {loading ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditHospital;
