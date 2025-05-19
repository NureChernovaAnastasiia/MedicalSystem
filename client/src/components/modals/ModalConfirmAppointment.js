import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../style/modalstyle/ModalConfirmAppointment.module.css';
import { bookDoctorScheduleById } from "../../http/doctorScheduleAPI";
import AlertPopup from "../../components/elements/AlertPopup";
import { PATIENT_APPOINTMENTS_ROUTE } from "../../utils/consts";

const ModalConfirmAppointment = ({ doctor, slot, date, onConfirm, onClose }) => {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      await bookDoctorScheduleById(slot.id);
      setAlert({ message: "Запис успішно підтверджено", type: "success" });

      setTimeout(() => {
        if (onConfirm) onConfirm();
        navigate(PATIENT_APPOINTMENTS_ROUTE); 
      }, 1200);
    } catch (error) {
      console.error("Помилка при бронюванні:", error);
      setAlert({
        message: "Не вдалося забронювати запис. Спробуйте ще раз.",
        type: "error",
      });
    }
  };

  return (
    <>
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.headerBar}>
            <span className={styles.headerText}>Підтвердження запису</span>
          </div>

          <div className={styles.infoBlock}>
            <p><strong>Ім'я лікаря: </strong>{doctor.last_name} {doctor.first_name} {doctor.middle_name}</p>
            <p><strong>Спеціалізація: </strong>{doctor.specialization}</p>
            <p><strong>Дата прийому: </strong>{date}</p>
            <p><strong>Час: </strong>{slot.time}</p>
            <p><strong>Місце прийому: </strong>{doctor.Hospital?.name}</p>
          </div>

          <div className={styles.footer}>
            <button className={styles.confirmButton} onClick={handleConfirm}>
              ✓ Підтвердити запис
            </button>
            <div className={styles.cancelContainer} onClick={onClose}>
              <span className={styles.cancelX}>×</span>
              <span className={styles.cancelText}>Скасувати</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConfirmAppointment;
