import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/PatientMedCard.module.css';

import iconDate from '../../img/icons/calendar.png';
import iconGender from '../../img/icons/gender.png';
import iconTelephone from '../../img/icons/telephone.png';
import iconEmail from '../../img/icons/email.png';
import iconAddress from '../../img/icons/address.png';
import iconHospital from '../../img/icons/hospital.png';
import photo from '../../img/Woman1.jpg';
import { PATIENT_EDITPERSONALINFO_ROUTE, PATIENT_MEDRECORDS_ROUTE, PATIENT_PRESCRIPTIONS_ROUTE } from '../../utils/consts';

const patientInfo = [
  { icon: iconDate, label: 'Дата народження:', value: '12.08.2004' },
  { icon: iconGender, label: 'Стать:', value: 'Жіноча' },
  { icon: iconTelephone, label: 'Телефон:', value: '+380671234567' },
  { icon: iconEmail, label: 'Email:', value: 'anastasiya.koval@gmail.com' },
  { icon: iconAddress, label: 'Адреса:', value: 'м. Київ, Україна, вул. Лесі Українки, 25' },
  { icon: iconHospital, label: 'Облік у лікарні:', value: 'Амбулаторія сімейної медицини "Цінність"' },
];

const diagnoses = [
  { text: 'Хронічний бронхіт', date: '20.02.2025' },
  { text: 'Гастрит', date: '17.10.2023' },
  { text: 'Гіпертонія', date: '03.03.2023' },
  { text: 'Остеохондроз ший...', date: '28.05.2024' },
];

const recipes = [
  'Парацетамол',
  'Амоксицилін',
  'Ібупрофен',
  'Но-шпа',
  'Лоратадин',
  'Ренні',
];

const PatientMedCard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Моя медична картка</h1>
      <p className={styles.description}>
        Переглядайте свою історію лікування, призначення лікарів та результати аналізів у зручному форматі.
      </p>

      <div className={styles.cardShadow}>
        <div className={styles.card}>
          <div className={styles.leftSide}>
            <img src={photo} alt="Patient" className={styles.profileImage} />
            <NavLink to={PATIENT_EDITPERSONALINFO_ROUTE} className={styles.editWarning}>
              <span className={styles.exclamation}>!</span>
              <span className={styles.editText}>Редагувати дані</span>
            </NavLink>
          </div>

          <div className={styles.rightSide}>
            <h2 className={styles.name}>Коваль Анастасія Володимирівна</h2>
            {patientInfo.map((info, index) => (
              <div key={index} className={styles.infoGroup}>
                <img src={info.icon} alt="icon" className={styles.icon} />
                <span className={styles.info}>
                  <strong>{info.label}</strong> <span className={styles.lightText}>{info.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.diagnosisColumn}>
          <h2 className={styles.sectionTitle}>Діагнози</h2>
          {diagnoses.map((diagnosis, index) => (
            <div key={index} className={styles.diagnosisItem}>
              <p className={styles.diagnosisText}>{diagnosis.text}</p>
              <p className={styles.diagnosisDate}>{diagnosis.date}</p>
              <NavLink to="/diagnosis-details" className={styles.detailsButton}>
                Детальніше
              </NavLink>
            </div>
          ))}
          <NavLink to={PATIENT_MEDRECORDS_ROUTE} className={styles.viewAll}>
            <span className={styles.viewAllText}>Переглянути всі діагнози ›</span>
          </NavLink>
        </div>

        <div className={styles.recipeColumn}>
          <h2 className={styles.sectionTitle}>Рецепти</h2>
          <div className={styles.recipeGrid}>
            {recipes.map((recipe, index) => (
              <div key={index} className={styles.recipeItem}>{recipe}</div>
            ))}
          </div>
          <NavLink to={PATIENT_PRESCRIPTIONS_ROUTE} className={styles.viewAll}>
            <span className={styles.viewAllText}>Всі рецепти ›</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default PatientMedCard;