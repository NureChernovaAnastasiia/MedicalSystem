import React, { useState } from 'react';
import styles from '../../style/modalstyle/ModalMedRecordCreation.module.css';
import AlertPopup from "../../components/elements/AlertPopup";
import { createMedicalRecord } from '../../http/medicalRecordAPI'; 

const ModalMedRecordCreation = ({ patientId, doctorId, onClose, onCreate }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleCreate = async () => {
    if (!diagnosis.trim() || !treatment.trim()) {
      setAlert({ message: 'Будь ласка, заповніть всі поля.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await createMedicalRecord({
        patient_id: patientId,
        doctor_id: doctorId,
        diagnosis,
        treatment,
      });

      setAlert({ message: 'Діагноз успішно створено!', type: 'success' });

      if (onCreate) {
        onCreate(response);
      }

      setTimeout(() => {
        setAlert(null);
        onClose(); 
      }, 1500);
    } catch (error) {
      setAlert({ message: 'Помилка при створенні діагнозу.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
            <div className={styles.header}>
            <h2 className={styles.title}>Встановлення діагнозу</h2>
            </div>

            <div className={styles.fieldBlock}>
            <label className={styles.label}>Назва діагнозу:</label>
            <input
                type="text"
                className={styles.input}
                placeholder="Введіть текст"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
            />
            </div>

            <div className={styles.fieldBlockLarge}>
            <label className={styles.label}>Лікування:</label>
            <textarea
                className={styles.textarea}
                placeholder="Введіть текст"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
            ></textarea>
            </div>

            <div className={styles.medsBlock}>
            <label className={styles.label}>Препарати:</label>
            <div className={styles.medsList}>
                <div className={styles.medItem}>Біфрен</div>
                <div className={styles.medItem}>Панадол</div>
                <div className={styles.addMed}>
                <span className={styles.addText}>+ Додати</span>
                </div>
            </div>
            </div>

            <div className={styles.actions}>
            <button
                className={styles.cancelButton}
                onClick={onClose}
                disabled={loading}
            >
                <span className={styles.closeIcon}>×</span>
                <span className={styles.closeText}>Скасувати</span>
            </button>
            <button
                className={styles.createButton}
                onClick={handleCreate}
                disabled={loading || !diagnosis.trim() || !treatment.trim()}
                >
                <span className={styles.createIcon}>✓</span>
                <span className={styles.createText}>
                    {loading ? 'Створення...' : 'Створити'}
                </span>
            </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default ModalMedRecordCreation;
