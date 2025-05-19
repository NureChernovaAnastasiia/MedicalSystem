import React from 'react';
import styles from '../../style/modalstyle/ModalPrescriptionInfo.module.css';
import { fetchPrescriptionPdf } from '../../http/prescriptionAPI';

import {
  iconDosage,
  iconFrequency,
  iconInstructions,
  iconPills
} from '../../utils/icons';

const ModalPrescriptionInfo = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const handleOpenPdf = () => {
    fetchPrescriptionPdf(prescription.id);
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2 className={styles.subtitle}>Інформація про препарат</h2>
          <h1 className={styles.title}>{prescription.medication}</h1>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <img src={iconPills} alt="icon" className={styles.icon} />
            <p className={styles.textItem}><strong>Форма випуску: </strong>{prescription.form}</p>
          </div>
          <div className={styles.infoItem}>
            <img src={iconDosage} alt="icon" className={styles.icon} />
            <p className={styles.textItem}><strong>Дозування: </strong>{prescription.dosage}</p>
          </div>
          <div className={styles.infoItem}>
            <img src={iconFrequency} alt="icon" className={styles.icon} />
            <p className={styles.textItem}><strong>Частота прийому: </strong>{prescription.frequency}</p>
          </div>
          <div className={styles.infoItemLarge}>
            <img src={iconInstructions} alt="icon" className={styles.icon} />
            <p className={styles.textItem}>
              <strong>Особливі вказівки:</strong>
              <br /> 
              –  {prescription.instructions || '—'}
            </p>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.pdfButton} onClick={handleOpenPdf}>Переглянути PDF</button>
          <button className={styles.closeButton} onClick={onClose}>
            <span className={styles.closeIcon}>×</span> Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPrescriptionInfo;
