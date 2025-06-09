import React, { useState, useMemo } from 'react';
import styles from '../../style/modalstyle/ModalCreateServiceInfo.module.css';
import { createLabTestInfo } from '../../http/analysisAPI';
import { createMedicalServiceInfo } from '../../http/servicesAPI';
import AlertPopup from '../../components/elements/AlertPopup';

const ModalCreateServiceInfo = ({ onClose, type, onCreated }) => {
  const isLab = type === 'lab';
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    preparation: '',
    indications: '',
    duration_days: '',
    duration_minutes: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const requiredFields = useMemo(() => (
    isLab
      ? ['name', 'price', 'description', 'preparation', 'indications', 'duration_days']
      : ['name', 'price', 'description', 'preparation', 'indications', 'duration_minutes']
  ), [isLab]);

  const isFormValid = requiredFields.every(field => String(formData[field]).trim() !== '');

  const handleChange = ({ target: { name, value } }) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const commonData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        preparation: formData.preparation.trim(),
        indications: formData.indications.trim(),
      };

      if (isLab) {
        await createLabTestInfo({
          ...commonData,
          duration_days: parseInt(formData.duration_days, 10),
        });
      } else {
        await createMedicalServiceInfo({
          ...commonData,
          duration_minutes: parseInt(formData.duration_minutes, 10),
          is_ready: true,
        });
      }

      setAlert({ type: 'success', message: 'Послугу успішно створено!' });
      setTimeout(() => {
        setAlert(null);
        onCreated?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Не вдалося створити послугу. Спробуйте ще раз.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {alert && <AlertPopup type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

        <div className={styles.header}>
          <h1 className={styles.title}>
            Створити {isLab ? 'аналіз' : 'медичну послугу'}
          </h1>
        </div>

        <div className={styles.fieldsContainer}>
          <div className={styles.column}>
            {[
              { label: 'Назва', name: 'name', type: 'text', placeholder: 'Введіть назву' },
              { label: 'Ціна', name: 'price', type: 'number', placeholder: 'Введіть ціну', min: 1 },
            ].map(({ label, name, type, placeholder, min }) => (
              <div className={styles.fieldBlock} key={name}>
                <label className={styles.label}>{label}:</label>
                <input type={type} name={name} min={min} className={styles.input} placeholder={placeholder}
                  value={formData[name]} onChange={handleChange} required
                />
              </div>
            ))}

            <div className={`${styles.fieldBlock} ${styles.fieldBlockLarge}`}>
              <label className={styles.label}>Опис:</label>
              <textarea name="description" className={styles.textarea} placeholder="Введіть опис"
                value={formData.description} onChange={handleChange} required
              />
            </div>
          </div>

          <div className={styles.column}>
            {[
              { label: 'Підготовка', name: 'preparation' },
              { label: 'Показання', name: 'indications' },
            ].map(({ label, name }) => (
              <div className={`${styles.fieldBlock} ${styles.fieldBlockLarge}`} key={name}>
                <label className={styles.label}>{label}:</label>
                <textarea name={name} className={styles.textarea} placeholder={`Введіть ${label.toLowerCase()}`}
                  value={formData[name]} onChange={handleChange} required
                />
              </div>
            ))}

            <div className={styles.fieldBlock}>
              <label className={styles.label}>
                Тривалість ({isLab ? 'дні' : 'хвилини'}):
              </label>
              <input
                type="number"
                name={isLab ? 'duration_days' : 'duration_minutes'}
                className={styles.input}
                min="1"
                placeholder={`Введіть тривалість в ${isLab ? 'днях' : 'хвилинах'}`}
                value={formData[isLab ? 'duration_days' : 'duration_minutes']}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className={styles.footerButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
            disabled={loading}
          >
            <span className={styles.closeIcon}>×</span>
            <span className={styles.closeText}>Скасувати</span>
          </button>

          <button
            onClick={handleSubmit}
            className={styles.createButton}
            disabled={!isFormValid || loading}
          >
            <span className={styles.createIcon}>✓</span>
            <span className={styles.createText}>
              {loading ? 'Створення...' : 'Створити'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateServiceInfo;
