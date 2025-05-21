import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientMedCard.module.css';
import { PATIENT_PRESCRIPTIONS_ROUTE } from '../../utils/consts';
import ModalPrescriptionInfo from '../../components/modals/ModalPrescriptionInfo'; 

const PrescriptionPreview = ({ prescriptions = [], referenceCount = 1 }) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null); 

  const sortedPrescriptions = [...prescriptions].sort(
    (a, b) => new Date(b.prescription_date) - new Date(a.prescription_date)
  );

  const handleOpenModal = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleCloseModal = () => {
    setSelectedPrescription(null);
  };

  return (
    <div className={styles.recipeColumn}>
      <h2 className={styles.sectionTitle}>Рецепти</h2>
      {sortedPrescriptions.length === 0 && (
        <p className={styles.noDiagnosesMessage}>Рецепти відсутні</p>
      )}
      <div className={styles.recipeGrid}>
        {sortedPrescriptions.slice(0, Math.max(1, referenceCount)).map((recipe, index) => (
          <div
            key={index}
            className={styles.recipeItem}
            onClick={() => handleOpenModal(recipe)} 
          >
            {recipe.medication}
          </div>
        ))}
      </div>
      <NavLink to={PATIENT_PRESCRIPTIONS_ROUTE} className={styles.viewAll}>
        <span className={styles.viewAllText}>Всі рецепти ›</span>
      </NavLink>

      {selectedPrescription && (
        <ModalPrescriptionInfo
          prescription={selectedPrescription}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PrescriptionPreview;

