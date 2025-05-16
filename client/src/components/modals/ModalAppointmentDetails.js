import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "../../style/modalstyle/ModalAppointmentDetails.module.css";
import { PATIENT_MEDCARD_ROUTE } from "../../utils/consts";

const ModalAppointmentDetails = ({ appointment, onClose, onGoToCard }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Деталі прийому</h2>

        <p className={styles.note}>
          * Після завершення прийому Ви можете переглянути результати аналізів та оновлення у медичній картці.
        </p>

        <div className={styles.detailsBox}>
          <p className={styles.detailsText}>
            <strong>Лікар: </strong>{"dfghj "}
            {appointment.Doctor?.last_name} {appointment.Doctor?.first_name} {appointment.Doctor?.middle_name}
            <br />
            <strong>Спеціалізація: </strong> {appointment.Doctor?.specialization}
            <br />
            <strong>Клініка: </strong>{" "}
            <br />
            <strong>Дата та час: </strong>{" "}
            {appointment.appointment_date} {appointment.DoctorSchedule?.start_time}
            <br />
            <strong>Статус: </strong>{" "}
            {appointment.status === "Scheduled" ? "Майбутній" : appointment.status}
            <br />
            <strong>Кабінет: </strong> {appointment.Doctor?.room_number || "—"}
            <br />
            <strong>Коментар: </strong> {appointment.notes || "—"}
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.backButton}>
            &lt; Повернутися назад
          </button>
          <NavLink to={PATIENT_MEDCARD_ROUTE} className={styles.goToCardButton}>
            Перейти до медичної картки &gt;
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ModalAppointmentDetails;
