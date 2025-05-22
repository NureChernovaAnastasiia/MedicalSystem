import React from 'react';
import styles from '../../style/patientpanel/PatientAppointments.module.css';
import { formatAppointmentDateOnly, formatAppointmentTimeOnly } from '../../utils/formatDate'; 

const AppointmentCard = ({ appointment, onDetailsClick, onCancelClick }) => {
  const doctor = `${appointment.Doctor?.last_name} ${appointment.Doctor?.first_name} ${appointment.Doctor?.middle_name}`;
  const specialization = appointment.Doctor?.specialization || 'Невідома спеціалізація';
  const location = `${appointment.Doctor?.Hospital?.name || "Невідома лікарня"},  ${appointment.Doctor?.Hospital?.address}`;

  const statusStyle = styles[appointment.type] || '';
  const canCancel = appointment.type === 'upcoming';

  const formattedDate = formatAppointmentDateOnly(appointment);
  const formattedTime = formatAppointmentTimeOnly(appointment);

  return (
    <div className={`${styles.appointmentCard} ${statusStyle}`}>
      <div className={styles.cardStatus}>{appointment.statusLabel}</div>

      <div className={styles.cardInfo}>
        <p><span className={styles.boldText}>Ім'я лікаря:</span><span> {doctor}</span></p>
        <p><span className={styles.boldText}>Спеціалізація:</span><span> {specialization}</span></p>
        <p><span className={styles.boldText}>Дата прийому:</span><span> {formattedDate}</span></p>
        <p><span className={styles.boldText}>Час:</span><span> {formattedTime}</span></p>
        <p><span className={styles.boldText}>Місце прийому:</span><span> {location}</span></p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardDetails} onClick={() => onDetailsClick(appointment)}>
          <span className={styles.questionMark}>?</span>
          <span className={styles.detailsText}>Переглянути деталі</span>
        </div>

        {canCancel && (
          <div className={styles.cardActions} onClick={() => onCancelClick(appointment)}>
            <span className={styles.cancelCross}>×</span>
            <span className={styles.cancelText}>Скасувати</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
