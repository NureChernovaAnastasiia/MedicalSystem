import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/PatientMedCard.module.css';
import { PATIENT_PRESCRIPTIONS_ROUTE } from '../../utils/consts';

const PrescriptionPreview = ({ prescriptions = [], referenceCount = 1 }) => {
  const sortedPrescriptions = [...prescriptions].sort(
    (a, b) => new Date(b.prescription_date) - new Date(a.prescription_date)
  );

  return (
    <div className={styles.recipeColumn}>
      <h2 className={styles.sectionTitle}>Рецепти</h2>
      {sortedPrescriptions.length === 0 && <p>Рецепти відсутні</p>}
      <div className={styles.recipeGrid}>
        {sortedPrescriptions.slice(0, Math.max(1, referenceCount)).map((recipe, index) => (
          <div key={index} className={styles.recipeItem}>{recipe.medication}</div>
        ))}
      </div>
      <NavLink to={PATIENT_PRESCRIPTIONS_ROUTE} className={styles.viewAll}>
        <span className={styles.viewAllText}>Всі рецепти ›</span>
      </NavLink>
    </div>
  );
};

export default PrescriptionPreview;
