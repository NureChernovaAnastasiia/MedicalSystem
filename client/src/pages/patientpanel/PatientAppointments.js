import React from 'react';
import styles from '../../style/PatientAppointments.module.css';

import iconSearch from '../../img/icons/search.png';

const AppointmentCard = ({ doctorName, specialization, date, time, location, status, type, canCancel }) => {
  return (
    <div className={`${styles.appointmentCard} ${styles[type]}`}>
      <div className={styles.cardStatus}>{status}</div>

      <div className={styles.cardInfo}>
        <p><span className={styles.boldText}>Ім'я лікаря:</span><span> {doctorName}</span></p>
        <p><span className={styles.boldText}>Спеціалізація:</span><span> {specialization}</span></p>
        <p><span className={styles.boldText}>Дата прийому:</span><span> {date}</span></p>
        <p><span className={styles.boldText}>Час:</span><span> {time}</span></p>
        <p><span className={styles.boldText}>Місце прийому:</span><span> {location}</span></p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardDetails}>
          <span className={styles.questionMark}>?</span>
          <span className={styles.detailsText}>Переглянути деталі</span>
        </div>

        {canCancel && (
          <div className={styles.cardActions}>
            <span className={styles.cancelCross}>×</span>
            <span className={styles.cancelText}>Скасувати</span>
          </div>
        )}
      </div>
    </div>
  );
};

const PatientAppointments = () => {
  const appointments = [
    {
      doctorName: 'Іваненко Іван',
      specialization: 'Терапевт',
      date: '10/05/2025',
      time: '10:00 - 10:30',
      location: 'Клініка "Здоров’я", Київ',
      status: '● Скасований',
      type: 'canceled',
      canCancel: false,
    },
    {
      doctorName: 'Петренко Петро',
      specialization: 'Кардіолог',
      date: '15/05/2025',
      time: '12:00 - 12:45',
      location: 'Медичний центр "Добро", Львів',
      status: '● Майбутній',
      type: 'upcoming',
      canCancel: true,
    },
    {
      doctorName: 'Сидоренко Олена',
      specialization: 'Дерматолог',
      date: '01/04/2025',
      time: '09:00 - 09:30',
      location: 'Поліклініка №5, Харків',
      status: '● Минулий',
      type: 'past',
      canCancel: false,
    },
  ];

  return (
    <div className={styles.patientAppointments}>
      <h1 className={styles.title}>Мої прийоми</h1>
      <p className={styles.subtitle}>Тут ви можете переглянути всі свої записи на прийом до лікаря.</p>

      <div className={styles.filterGroup}>
        <select className={styles.select}>
          <option>Усі прийоми</option>
          <option>Майбутні</option>
          <option>Минулий</option>
          <option>Скасовані</option>
        </select>

        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <img src={iconSearch} alt="Search Icon" />
          </div>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Введіть ім'я лікаря або спеціалізацію"
          />
        </div>
      </div>

      <div className={styles.appointmentsCards}>
        {appointments.map((appointment, index) => (
          <AppointmentCard
            key={index}
            {...appointment}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientAppointments;
