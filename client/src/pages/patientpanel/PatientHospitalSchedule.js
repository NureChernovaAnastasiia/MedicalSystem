import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../style/PatientHospitalSchedule.module.css';

import iconHospital from '../../img/icons/hospital.png';
import iconAddress from '../../img/icons/address.png';
import iconTelephone from '../../img/icons/telephone.png';
import iconEmail from '../../img/icons/email.png';
import { PATIENT_DOCAPPOINTMENT_ROUTE } from '../../utils/consts';

const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота', 'Неділя'];

const schedule = [
  { name: 'Петрова О.В.', time: { 'Понеділок': '9:00-13:00', 'П’ятниця': '12:00-15:30' } },
  { name: 'Демчишина Г.О.', time: { 'Понеділок': '12:00-15:30', 'Середа': '9:00-13:00' } },
  { name: 'Турянська В.Н.', time: { 'Середа': '9:00-13:00', 'П’ятниця': '12:00-15:30' } },
  { name: 'Волошин М.К.', time: { 'Субота': '12:00-16:00' } },
  { name: 'Некрасов Г.В.', time: { 'Четвер': '9:00-13:00' } },
  { name: 'Скальницька І.Ф.', time: { 'Вівторок': '9:00-13:00' } },
];

const ContactInfo = ({ icon, text }) => (
  <div className={styles.contactItem}>
    <img src={icon} alt="Icon" className={styles.iconSmall} />
    <span className={styles.contactText}>{text}</span>
  </div>
);

const PatientHospitalSchedule = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className={styles.container}>
      
      <div className={styles.headerContainer}>
        <div className={styles.headerBox}>
          
          <div className={styles.hospitalNameBlock}>
            <img src={iconHospital} alt="Hospital Icon" className={styles.hospitalIcon} />
            <span className={styles.hospitalName}>
              Амбулаторія сімейної медицини "Цінність"
            </span>
          </div>

          <div className={styles.middleRow}>
            <div className={styles.clinicType}>Приватна клініка</div>
            <div className={styles.schedule}>Пн-Сб 08:00–20:00, Нд — вихідний</div>
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.leftSide}>
              <ContactInfo icon={iconAddress} text="Київ, вул. Єфремова Академіка, 8А" />
            </div>
            <div className={styles.rightSide}>
              <ContactInfo icon={iconTelephone} text="+380671234567" />
              <ContactInfo icon={iconEmail} text="tcinnistamb@gmail.com" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scheduleContainer}>
        <p className={styles.subtitle}>
          Нижче представлений графік прийому лікарів на поточний тиждень.
        </p>

        <div className={styles.scheduleWrapper}>
          <div className={styles.dayHeader}>
            <div className={styles.emptyCell}></div>
            {days.map(day => (
              <div key={day} className={styles.dayItem}>{day}</div>
            ))}
          </div>

          <div className={styles.scheduleTable}>
            {schedule.map((doctor, index) => (
              <div key={index} className={styles.scheduleRow}>
                <div className={styles.doctorName}>{doctor.name}</div>
                {days.map(day => (
                  <div key={day} className={styles.scheduleCell}>
                    {doctor.time[day] || ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.docAppointment}>
        <p className={styles.subtitle}>Хочете знайти лікаря за спеціальністю?</p>
        <NavLink to={PATIENT_DOCAPPOINTMENT_ROUTE}>
          <button className={styles.orderButton}>Записатися до лікаря</button>
        </NavLink>
      </div>

      <div className={styles.backLink}>
        <button onClick={goBack} className={styles.backButton}>
          ‹ Повернутися назад до списку аналізів
        </button>
      </div>

    </div>
  );
};

export default PatientHospitalSchedule;
