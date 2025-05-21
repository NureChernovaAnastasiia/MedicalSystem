import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientMedCard.module.css';
import { PATIENT_MEDDETAIL_ROUTE, PATIENT_MEDRECORDS_ROUTE } from '../../utils/consts';

const DiagnosisPreview = ({ diagnoses = [] }) => {
  const sortedDiagnoses = [...diagnoses].sort(
    (a, b) => new Date(b.record_date) - new Date(a.record_date)
  );

  return (
    <div className={styles.diagnosisColumn}>
      <h2 className={styles.sectionTitle}>Діагнози</h2>
      {sortedDiagnoses.length === 0 && (
        <p className={styles.noDiagnosesMessage}>Діагнози відсутні</p>
      )}
      {sortedDiagnoses.slice(0, 4).map((diagnosis, index) => (
        <div key={index} className={styles.diagnosisItem}>
          <p className={styles.diagnosisText}>{diagnosis.diagnosis}</p>
          <p className={styles.diagnosisDate}>
            {new Date(diagnosis.record_date).toLocaleDateString('uk-UA')}
          </p>
          <NavLink to={`${PATIENT_MEDDETAIL_ROUTE}/${diagnosis.id}`} className={styles.detailsButton}>
            Детальніше
          </NavLink>
        </div>
      ))}
      <NavLink to={PATIENT_MEDRECORDS_ROUTE} className={styles.viewAll}>
        <span className={styles.viewAllText}>Переглянути всі діагнози ›</span>
      </NavLink>
    </div>
  );
};

export default DiagnosisPreview;
