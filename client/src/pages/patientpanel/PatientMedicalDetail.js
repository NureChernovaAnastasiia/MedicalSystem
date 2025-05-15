import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../style/PatientMedicalDetail.module.css';

import iconDoctor from '../../img/icons/doctor.png';
import iconHospital from '../../img/icons/hospital.png';

const PatientMedicalDetail = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };

  const diagnosis = {
    title: 'Хронічний бронхіт',
    date: '20.02.2025',
  };

  const recommendations = [
    'Уникати алергенів',
    'Використання інгалятора при нападах',
    'Регулярні консультації кожні 6 місяців',
  ];

  const medicines = ['Сальбутамол', 'Будесонід'];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Детальна інформація про діагноз</h1>

      <div className={styles.diagnosisHeader}>
        <h2 className={styles.diagnosisTitle}>{diagnosis.title}</h2>
        <p className={styles.diagnosisDate}>Дата встановлення: {diagnosis.date}</p>
      </div>

      <div className={styles.doctorNotesSection}>
        <div className={styles.leftColumn}>
          <div className={styles.detailItem}>
            <img src={iconDoctor} alt="Doctor Icon" className={styles.icon} />
            <p className={styles.detailText}><strong>Лікар:</strong> Олександра Петрова</p>
          </div>
          <div className={styles.detailItem}>
            <img src={iconHospital} alt="Hospital Icon" className={styles.icon} />
            <p className={styles.detailText}><strong>Заклад:</strong> Амбулаторія сімейної медицини "Цінність"</p>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <h3 className={styles.notesTitle}>Записи лікаря</h3>
          <div className={styles.recommendationsBox}>
            <p className={styles.recommendations}>
              Рекомендації:
              <br />
              {recommendations.map((item, index) => (
                <React.Fragment key={index}>
                  – {item}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.prescriptionsSection}>
        <h3 className={styles.prescriptionsTitle}>Призначені препарати</h3>
        <div className={styles.prescriptionsList}>
          {medicines.map((med, index) => (
            <div className={styles.medicineCard} key={index}>
              {med}
            </div>
          ))}
        </div>
      </div>

      <button onClick={goBack} className={styles.backButton}>
        ‹ Повернутися назад до списку аналізів
      </button>
    </div>
  );
};

export default PatientMedicalDetail;
