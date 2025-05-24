import React, { useState } from 'react';
import styles from '../../style/modalstyle/ModalPrescriptionCreation.module.css';
import { medicationForms } from '../../constants/medicationForms';

const ModalPrescriptionCreation = ({ onClose, onSuccess }) => {
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [form, setForm] = useState('');
  const [quantityPerDose, setQuantityPerDose] = useState('');
  const [frequency, setFrequency] = useState('');
  const [prescriptionExpiration, setPrescriptionExpiration] = useState('');

  const handleCreate = () => {
    const prescriptionData = {
      medication,
      dosage,
      instructions,
      form,
      quantity_per_dose: quantityPerDose,
      frequency,
      prescription_expiration: prescriptionExpiration,
    };

    onSuccess?.(prescriptionData);
  };

  const isFormValid =
    medication && dosage && form && quantityPerDose && frequency && prescriptionExpiration;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>Створення препарату</span>
        </div>

        <div className={styles.columnsContainer}>
          <div className={styles.leftColumn}>
            <div className={styles.fieldBlock}>
              <label className={styles.label}>Назва препарату:</label>
              <input
                className={styles.input}
                type="text"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
              />
            </div>

            <div className={styles.fieldBlock}>
              <label className={styles.label}>Дозування:</label>
              <input
                className={styles.input}
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>

            <div className={styles.fieldBlock}>
              <label className={styles.label}>Особливі вказівки:</label>
              <textarea
                className={styles.textarea}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.fieldBlock}>
              <label className={styles.label}>Форма випуску:</label>
              <select
                className={styles.input}
                value={form}
                onChange={(e) => setForm(e.target.value)}
              >
                <option value="">Оберіть форму</option>
                {medicationForms.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.fieldBlock}>
              <label className={styles.label}>Кількість на прийом:</label>
              <input
                className={styles.input}
                type="text"
                value={quantityPerDose}
                onChange={(e) => setQuantityPerDose(e.target.value)}
              />
            </div>

            <div className={styles.fieldBlock}>
              <label className={styles.label}>Частота прийому:</label>
              <input
                className={styles.input}
                type="text"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>

            <div className={styles.fieldBlock}>
              <label className={styles.label}>Термін дії рецепту:</label>
              <input
                className={styles.input}
                type="date"
                value={prescriptionExpiration}
                onChange={(e) => setPrescriptionExpiration(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            <span className={styles.closeIcon}>×</span> Скасувати
          </button>
          <button
            className={styles.createButton}
            onClick={handleCreate}
            disabled={!isFormValid}
          >
            <span className={styles.createIcon}>✓</span>
            <span className={styles.createText}>Додати</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPrescriptionCreation;
