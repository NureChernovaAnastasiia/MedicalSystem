import React from "react";
import styles from "../../style/modalstyle/ModalScheduleDetail.module.css";
import { formatAppointmentDate } from "../../utils/formatDate";

const ModalScheduleDetail = ({ schedule, onClose, onDelete }) => {
  if (!schedule) return null;

  const appointment = { DoctorSchedule: schedule };

  const doctorFullName = `${schedule.Doctor.last_name} ${schedule.Doctor.first_name} ${schedule.Doctor.middle_name}`;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.title}>Деталі розкладу</h2>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            <strong>Лікар: </strong> {doctorFullName}
            <br />
            <strong>Спеціалізація: </strong> {schedule.Doctor.specialization}
            <br />
            <strong>Клініка: </strong>{" "}
            {schedule.Doctor.Hospital?.name || "Невідома лікарня"}
            <br />
            <strong>Кабінет: </strong>{" "}
            {schedule.Doctor.office_number || "—"}, кімната{" "}
            {schedule.Doctor.room_number || "—"}
            <br />
            <strong>Дата та час: </strong> {formatAppointmentDate(appointment)}
          </p>

          {schedule.is_booked ? (
            <div className={styles.detailsBox}>
                <p className={styles.detailsLabel}>Дані прийому</p>
                <p className={styles.detailsText}>
                <strong>Пацієнт: </strong>
                {schedule.Appointments[0]?.Patient
                    ? `${schedule.Appointments[0].Patient.last_name} ${schedule.Appointments[0].Patient.first_name} ${schedule.Appointments[0].Patient.middle_name || ""}`
                    : "Невідомий"}
                <br />
                <strong>Коментарі: </strong>{" "}
                {schedule.Appointments[0]?.notes || "Відсутні"}
                </p>
            </div>
        ) : null}
        </div>

        <div className={styles.actions}>
          <button className={styles.backButton} onClick={onClose}>‹ Повернутися назад</button>
          {!schedule.is_booked && (
            <button className={styles.cancelButton} onClick={onDelete}>
                <span className={styles.closeIcon}>×</span>
                <span className={styles.closeText}>Видалити з розкладу</span>
            </button>
          )}      
        </div>
      </div>
    </div>
  );
};

export default ModalScheduleDetail;
