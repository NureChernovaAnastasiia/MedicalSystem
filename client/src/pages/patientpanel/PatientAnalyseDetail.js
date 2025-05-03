import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../style/PatientAnalyseDetail.module.css';

import iconDoctor from '../../img/icons/doctor.png';
import iconHospital from '../../img/icons/hospital.png';

const PatientAnalyseDetail = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Деталі аналізу</h1>

      <div className={styles.analysisHeader}>
        <h2 className={styles.analysisTitle}>Загальний аналіз крові</h2>
        <p className={styles.analysisDate}>Дата проведення: 14.01.2025</p>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <img src={iconDoctor} alt="Doctor Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Відповідаючий лікар:</strong> Олександра Петрова</p>
        </div>
        <div className={styles.detailItem}>
          <img src={iconHospital} alt="Hospital Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Місце проведення:</strong> Амбулаторія сімейної медицини "Цінність"</p>
        </div>
      </div>

      <h3 className={styles.resultsTitle}>Результати</h3>
      <div className={styles.resultsBlock}>
        <p className={styles.resultsText}>
          Гемоглобін 145 г/л (130–160 г/л) — У нормі<br />
          Лейкоцити 12.0 (4.0–9.0) — Підвищено<br />
          ШОЕ 8 мм/год (2–15 мм/год) — У нормі<br />
          Тромбоцити 95 (150–400) — Знижено
        </p>
        <a href="#" className={styles.viewPdf}>Переглянути PDF</a>
      </div>
      
      <h3 className={styles.commentTitle}>Коментар лікаря</h3>
      <div className={styles.commentBlock}>
        <p className={styles.commentText}>
          Лейкоцити підвищені, що може свідчити про запальний процес. Рекомендується консультація терапевта.
        </p>
      </div>

      <div className={styles.backLink}>
        <button onClick={goBack} className={styles.backButton}>
        ‹ Повернутися назад до списку аналізів
        </button>
      </div>
    </div>
  );
};

export default PatientAnalyseDetail;
