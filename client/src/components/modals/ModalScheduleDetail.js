import React from "react";
import styles from "../../style/modalstyle/ModalScheduleDetail.module.css";
import { formatAppointmentDate } from "../../utils/formatDate";

const formatTime = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); 
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};


const ModalScheduleDetail = ({ schedule, onClose, onDelete }) => {
  if (!schedule) return null;

  const isDoctorSchedule = !!schedule.Doctor;
  const isAnalysisOrService = !isDoctorSchedule && (schedule.test_name || schedule.hospital);

  if (isDoctorSchedule) {
    const appointment = { DoctorSchedule: schedule };
    const doctorFullName = `${schedule.Doctor.last_name} ${schedule.Doctor.first_name} ${schedule.Doctor.middle_name}` || schedule.doctor;

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
              <strong>Клініка: </strong> {schedule.Doctor.Hospital?.name || "Невідома лікарня"}
              <br />
              <strong>Кабінет: </strong> {schedule.Doctor.office_number || "—"}, кімната {schedule.Doctor.room_number || "—"}
              <br />
              <strong>Дата та час: </strong> {formatAppointmentDate(appointment)}
            </p>

            {schedule.is_booked && (
              <div className={styles.detailsBox}>
                <p className={styles.detailsLabel}>Дані прийому</p>
                <p className={styles.detailsText}>
                  <strong>Пацієнт: </strong>
                  {schedule.Appointments?.[0]?.Patient
                    ? `${schedule.Appointments[0].Patient.last_name} ${schedule.Appointments[0].Patient.first_name} ${schedule.Appointments[0].Patient.middle_name || ""}`
                    : "Невідомий"}
                  <br />
                  <strong>Коментарі: </strong> {schedule.Appointments?.[0]?.notes || "Відсутні"}
                </p>
              </div>
            )}
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
  }

  if (isAnalysisOrService) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 className={styles.title}>Деталі розкладу</h2>

          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              <strong>Послуга: </strong> {schedule.test_name || "Невідома послуга"}
              <br />
              <strong>Клініка: </strong> {schedule.hospital || "Невідома клініка"}
              <br />
              <strong>Лікар: </strong> {schedule.doctor || "Невідомий"}
              <br />
              <strong>Дата та час: </strong> {formatDate(schedule.date) || "—"}, {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
              <br />
              <strong>Статус: </strong> {schedule.is_booked ? "Заброньовано" : "Вільно"}
            </p>
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
  }

  return null;
};

export default ModalScheduleDetail;
