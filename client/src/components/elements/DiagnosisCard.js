import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from '../../style/PatientMedicalRecords.module.css';
import iconDiagnosis from '../../img/icons/diagnosis.png';
import { PATIENT_MEDDETAIL_ROUTE } from '../../utils/consts';

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;
};

const DiagnosisCard = ({ diagnosis, record_date }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <img src={iconDiagnosis} alt="icon" className={styles.iconDiagnosis} />
      <p className={styles.date}>Дата встановлення: {formatDate(record_date)}</p>
    </div>
    <h3 className={styles.cardTitle}>{diagnosis}</h3>
    <NavLink to={PATIENT_MEDDETAIL_ROUTE} className={styles.detailsButton}>
      <span className={styles.cardFooterText}>Деталі хвороби</span>
    </NavLink>
  </div>
);

export default DiagnosisCard;
