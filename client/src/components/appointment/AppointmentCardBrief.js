import React from "react";
import styles from "../../style/patientpanel/PatientDashboard.module.css";

const AppointmentCard = ({ appointment, onDetailsClick }) => {
  const doctor = `${appointment.Doctor?.last_name} ${appointment.Doctor?.first_name} ${appointment.Doctor?.middle_name}`;
  const location = appointment.Doctor?.Hospital?.name || "Невідома лікарня";

  return (
    <div className={styles.appointmentCard}>
      <p className={styles.appointmentInfo}>
        <strong>Дата і час прийому:</strong> <span className={styles.lightText}>{appointment.formattedDate}</span> <br />
        <strong>Лікар:</strong> <span className={styles.lightText}>{doctor}</span> <br />
        <strong>Місцезнаходження:</strong> <span className={styles.lightText}>{location}</span>
      </p>
      <div className={styles.appointmentDetails} onClick={() => onDetailsClick(appointment)}>
        <span className={styles.questionMark}>?</span>
        <span className={styles.detailsText}>Деталі прийому</span>
      </div>
    </div>
  );
};

export default AppointmentCard;
