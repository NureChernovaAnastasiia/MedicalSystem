import React, { useContext } from "react";
import { NavLink } from 'react-router-dom';
import styles from "../../style/modalstyle/ModalAppointmentDetails.module.css";
import { PATIENT_MEDCARD_ROUTE } from "../../utils/consts";
import { formatAppointmentDate } from "../../utils/formatDate";
import { Context } from "../../index"; 

const ModalAppointmentDetails = ({ appointment, onClose }) => {
  const { user } = useContext(Context); 
  const role = user._role; 

  const formatStatus = (status) => {
    switch (status) {
      case "Scheduled":
        return "Майбутній";
      case "Completed":
        return "Завершений";
      case "Cancelled":
        return "Скасований";
      default:
        return "Невідомий";
    }
  };

  const formattedDateTime = formatAppointmentDate(appointment);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Деталі прийому</h2>

        <p className={styles.note}>
          * Після завершення прийому Ви можете переглянути результати аналізів та оновлення у медичній картці.
        </p>

        <div className={styles.detailsBox}>
          <p className={styles.detailsText}>
            <strong>Лікар: </strong>{" "}
            {appointment.Doctor?.last_name} {appointment.Doctor?.first_name} {appointment.Doctor?.middle_name}
            <br />
            <strong>Спеціалізація: </strong> {appointment.Doctor?.specialization}
            <br />
            <strong>Клініка: </strong>{" "}
            {appointment.Doctor?.Hospital?.name || "Невідома лікарня"}, {appointment.Doctor?.Hospital?.address}
            <br />
            <strong>Дата та час: </strong> {formattedDateTime}
            <br />
            <strong>Статус: </strong> {formatStatus(appointment.computed_status || appointment.status)}
            <br />
            <strong>Кабінет: </strong> {appointment.Doctor?.room_number || "—"}
            <br />
            <strong>Коментар: </strong> {appointment.notes || "Коментар відсутній"}
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.backButton}>
            &lt; Повернутися назад
          </button>
          
          {role === 'Patient' && (
            <NavLink to={PATIENT_MEDCARD_ROUTE} className={styles.goToCardButton}>
              Перейти до медичної картки &gt;
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAppointmentDetails;
