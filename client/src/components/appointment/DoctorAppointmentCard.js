import React from 'react';
import styles from '../../style/doctorpanel/DoctorAppointments.module.css';
import { formatAppointmentDateOnly, formatAppointmentTimeOnly } from '../../utils/formatDate';

const DoctorAppointmentCard = ({ appointment, onDetailsClick, onCancelClick }) => {
  const patientName = `${appointment.Patient?.last_name || ''} ${appointment.Patient?.first_name || ''} ${appointment.Patient?.middle_name || ''}`;
  const formattedDate = formatAppointmentDateOnly(appointment);
  const formattedTime = formatAppointmentTimeOnly(appointment); 
  const location = `${appointment.Doctor?.Hospital?.name || 'Невідома установа'}, ${appointment.Doctor?.Hospital?.address || ''}`;

  const statusStyle = styles[appointment.type] || '';
  const canCancel = appointment.type === 'upcoming';

  return (
    <div className={`${styles.appointmentCard} ${statusStyle}`}>
      <div className={styles.cardStatus}>{appointment.statusLabel}</div>

      <div className={styles.cardInfo}>
        <p><span className={styles.boldText}>Ім’я пацієнта:</span><span> {patientName}</span></p>
        <p><span className={styles.boldText}>Дата прийому:</span><span> {formattedDate}</span></p>
        <p><span className={styles.boldText}>Час:</span><span> {formattedTime}</span></p>
        <p><span className={styles.boldText}>Місце прийому:</span><span> {location}</span></p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardDetails} onClick={() => onDetailsClick(appointment)}>
          <button className={styles.detailsText}>Внести дані</button>
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

export default DoctorAppointmentCard;
