import React, { useState } from "react";
import styles from "../../style/modalstyle/ModalCancelAppointment.module.css";
import { cancelAppointment } from "../../http/appointmentAPI";
import AlertPopup from "../../components/elements/AlertPopup";

const REASONS = [
  { value: "bad_feeling", label: "Погане самопочуття" },
  { value: "plans_changed", label: "Зміна планів" },
  { value: "mistake", label: "Запис помилковий" },
];

const getFormattedDateTime = (appointment) => {
  const schedule = appointment.DoctorSchedule || appointment.LabTestSchedule || appointment.MedicalServiceSchedule;

  if (appointment.DoctorSchedule) {
    const appointmentDate = appointment.appointment_date || schedule.appointment_date;
    const startTime = schedule?.start_time;

    if (appointmentDate && startTime) {
      const dateObj = new Date(`${appointmentDate}T${startTime}`);
      return dateObj.toLocaleString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  } else if (schedule?.start_time) {
    const dateObj = new Date(schedule.start_time);
    if (!isNaN(dateObj)) {
      return dateObj.toLocaleString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  }

  return "Дата і час не вказані";
};

const ModalCancelAppointment = ({ appointment, onClose, onAppointmentCancelled }) => {
  const [alert, setAlert] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");

  const handleReasonChange = (e) => setSelectedReason(e.target.value);

  const handleCancel = async () => {
    if (!selectedReason) {
      return setAlert({ message: "Оберіть причину скасування", type: "error" });
    }

    try {
      await cancelAppointment(appointment.id);
      setAlert({ message: "Запис успішно скасовано", type: "success" });

      setTimeout(() => {
        onAppointmentCancelled(appointment.id);
        onClose();
      }, 1200);
    } catch (error) {
      console.error("Помилка при скасуванні прийому:", error);
      setAlert({
        message: "Не вдалося скасувати прийом. Спробуйте ще раз.",
        type: "error",
      });
    }
  };

  return (
    <>
      {alert && <AlertPopup message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <h2 className={styles.title}>Ви дійсно хочете скасувати цей запис?</h2>
          <p className={styles.warning}>
            * Після скасування запису ви не зможете його відновити. Якщо потрібно, ви можете записатися знову через "Запис до лікаря".
          </p>

          <h3 className={styles.sectionTitle}>Інформація про прийом</h3>
          <div className={styles.infoBox}>
            <p className={styles.infoText}>
              <strong>Дата і час прийому: </strong>
              {getFormattedDateTime(appointment)} <br />
              <strong>Лікар: </strong>
              {`${appointment.Doctor?.last_name} ${appointment.Doctor?.first_name} ${appointment.Doctor?.middle_name}`} <br />
              <strong>Місцезнаходження: </strong>
              {appointment.Doctor?.Hospital?.name || "Невідома лікарня"}, {appointment.Doctor?.Hospital?.address}
            </p>
          </div>

          <div className={styles.inlineReason}>
            <label className={styles.reasonLabel}>Оберіть причину скасування</label>
            <div className={styles.selectWrapper}>
              <select className={styles.select} value={selectedReason} onChange={handleReasonChange}>
                <option value="" disabled>Причини</option>
                {REASONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.footer}>
            <button className={styles.backButton} onClick={onClose}>‹ Повернутися назад</button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCancelAppointment;
