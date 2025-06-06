import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientAppointments.module.css';
import { formatAppointmentDateOnly, formatAppointmentTimeOnly } from '../../utils/formatDate';
import { DOCTOR_DETAPPOINTMENT_ROUTE } from '../../utils/consts';
import { Context } from '../../index';

const DoctorAppointmentCard = ({ appointment, onDetailsClick, onCancelClick }) => {
  const { user } = useContext(Context); 
  const role = user._role;

  const patientName = `${appointment.Patient?.last_name || ''} ${appointment.Patient?.first_name || ''} ${appointment.Patient?.middle_name || ''}`.trim();
  const doctorName = `${appointment.Doctor?.last_name || ''} ${appointment.Doctor?.first_name || ''} ${appointment.Doctor?.middle_name || ''}`.trim();

  const formattedDate = formatAppointmentDateOnly(appointment);
  const formattedTime = formatAppointmentTimeOnly(appointment); 
  const location = `${appointment.Doctor?.Hospital?.name || 'Невідома установа'}, ${appointment.Doctor?.Hospital?.address || ''}`;
  const specialization = appointment.Doctor?.specialization;

  const statusStyle = styles[appointment.type] || '';
  const canCancel = appointment.type === 'upcoming';

  if (role === 'Doctor') {
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
          <div className={styles.cardDetails} >
            <NavLink to={`${DOCTOR_DETAPPOINTMENT_ROUTE}/${appointment.id}`} style={{ textDecoration: 'none' }}>
              <button className={styles.detailsButton}>Внести дані</button>
            </NavLink>
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
  } else if (role === 'Admin') {
    return (
      <div className={`${styles.appointmentCard} ${statusStyle}`}>
        <div className={styles.cardStatus}>{appointment.statusLabel}</div>

        <div className={styles.cardInfo}>
          <p><span className={styles.boldText}>Ім’я пацієнта:</span><span> {patientName}</span></p>
          <p><span className={styles.boldText}>Ім’я лікаря:</span><span> {doctorName}</span></p>
          <p><span className={styles.boldText}>Дата прийому:</span><span> {formattedDate}</span></p>
          <p><span className={styles.boldText}>Час:</span><span> {formattedTime}</span></p>
          <p><span className={styles.boldText}>Місце прийому:</span><span> {location}</span></p>
        </div>

        <div className={styles.cardFooter}>
          {canCancel && (
            <div className={styles.cardActions} onClick={() => onCancelClick(appointment)}>
              <span className={styles.cancelCross}>×</span>
              <span className={styles.cancelText}>Скасувати</span>
            </div>
          )}
        </div>
      </div>
    );
  } else if (role === 'Patient') {
    return (
      <div className={`${styles.appointmentCard} ${statusStyle}`}>
      <div className={styles.cardStatus}>{appointment.statusLabel}</div>

      <div className={styles.cardInfo}>
        <p><span className={styles.boldText}>Ім'я лікаря:</span><span> {doctorName}</span></p>
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
  }

  return null;
};

export default DoctorAppointmentCard;
