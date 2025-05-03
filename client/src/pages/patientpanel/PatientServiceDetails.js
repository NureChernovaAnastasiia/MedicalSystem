import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../style/PatientAnalyseDetail.module.css';

import iconDoctor from '../../img/icons/doctor.png';
import iconHospital from '../../img/icons/hospital.png';

const PatientServiceDetails = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Деталі послуги</h1>

      <div className={styles.analysisHeader}>
        <h2 className={styles.analysisTitle}>УЗД органів черевної порожнини</h2>
        <p className={styles.analysisDate}>Дата проведення: 20.01.2025</p>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <img src={iconDoctor} alt="Doctor Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Відповідаючий лікар:</strong> Іван Іванов</p>
        </div>
        <div className={styles.detailItem}>
          <img src={iconHospital} alt="Hospital Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Місце проведення:</strong> Медичний центр "Здоров'я"</p>
        </div>
      </div>

      <h3 className={styles.resultsTitle}>Результати</h3>
      <div className={styles.resultsBlock}>
        <p className={styles.resultsText}>
          Печінка: розміри в нормі, структура однорідна.<br />
          Жовчний міхур: без конкрементів, стінки не потовщені.<br />
          Підшлункова залоза: розміри в межах норми.<br />
          Селезінка: не збільшена.
        </p>
        <a href="#" className={styles.viewPdf}>Переглянути PDF</a>
      </div>
      
      <h3 className={styles.commentTitle}>Коментар лікаря</h3>
      <div className={styles.commentBlock}>
        <p className={styles.commentText}>
          Ультразвукове обстеження не виявило патологічних змін. Рекомендовано щорічний профілактичний огляд.
        </p>
      </div>

      <div className={styles.backLink}>
        <button onClick={goBack} className={styles.backButton}>
          ‹ Повернутися назад до списку послуг
        </button>
      </div>
    </div>
  );
};

export default PatientServiceDetails;
