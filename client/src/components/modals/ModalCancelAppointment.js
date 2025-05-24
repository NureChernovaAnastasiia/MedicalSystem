import React, { useState, useContext } from "react";
import styles from "../../style/modalstyle/ModalCancelAppointment.module.css";
import { cancelAppointment } from "../../http/appointmentAPI";
import AlertPopup from "../../components/elements/AlertPopup";
import { formatAppointmentDate } from "../../utils/formatDate"; 
import { REASONS } from "../../constants/cancellationReasons"; 
import { Context } from "../../index"; 

const ModalCancelAppointment = ({ appointment, onClose, onAppointmentCancelled }) => {
  const { user } = useContext(Context);
  const role = user._role;

  const [alert, setAlert] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");

  const handleReasonChange = (e) => setSelectedReason(e.target.value);

  const handleCancel = async () => {
    if (!selectedReason) {
      return setAlert({ message: "Оберіть причину скасування", type: "error" });
    }

    try {
      await cancelAppointment(appointment.id, selectedReason);
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

  const personLabel = role === "Patient" ? "Лікар" : "Пацієнт";
  const personName = role === "Patient"
    ? `${appointment.Doctor?.last_name} ${appointment.Doctor?.first_name} ${appointment.Doctor?.middle_name}`
    : `${appointment.Patient?.last_name} ${appointment.Patient?.first_name} ${appointment.Patient?.middle_name}`;

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
              {formatAppointmentDate(appointment)} <br />
              <strong>{personLabel}: </strong>
              {personName} <br />
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
