import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import styles from '../../style/patientpanel/PatientMedicalRecords.module.css';
import { iconDiagnosis } from '../../utils/icons';
import { PATIENT_MEDDETAIL_ROUTE, DOCTOR_MEDDETAIL_ROUTE, ADMIN_MEDDETAIL_ROUTE } from '../../utils/consts';
import { Context } from '../../index';

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`;
};

const DiagnosisCard = ({ id, diagnosis, record_date }) => {
  const { user } = useContext(Context);
  const role = user._role;

  const route =
    role === 'Patient'
      ? `${PATIENT_MEDDETAIL_ROUTE}/${id}`
      : role === 'Doctor'
      ? `${DOCTOR_MEDDETAIL_ROUTE}/${id}`
      : role === 'Admin'
      ? `${ADMIN_MEDDETAIL_ROUTE}/${id}`
      : '#';

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <img src={iconDiagnosis} alt="icon" className={styles.iconDiagnosis} />
        <p className={styles.date}>Дата встановлення: {formatDate(record_date)}</p>
      </div>
      <h3 className={styles.cardTitle}>{diagnosis}</h3>
      <NavLink to={route} className={styles.detailsButton}>
        <span className={styles.cardFooterText}>Деталі хвороби</span>
      </NavLink>
    </div>
  );
};

export default DiagnosisCard;
