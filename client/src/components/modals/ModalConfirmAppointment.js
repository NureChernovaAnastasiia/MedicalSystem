import React from "react";
import styles from '../../style/modalstyle/ModalConfirmAppointment.module.css';

const ModalConfirmAppointment = ({ doctor, slot, date, onConfirm, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.headerBar}>
          <span className={styles.headerText}>Підтвердження запису</span>
        </div>

        <div className={styles.infoBlock}>
          <p><strong>Ім'я лікаря: </strong>{doctor.last_name} {doctor.first_name}</p>
          <p><strong>Спеціалізація: </strong>{doctor.specialization}</p>
          <p><strong>Дата прийому: </strong>{date}</p>
          <p><strong>Час: </strong>{slot.time}</p>
          <p><strong>Місце прийому: </strong>{doctor.Hospital?.name}</p>
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmButton} onClick={onConfirm}>✓ Підтвердити запис</button>
          <div className={styles.cancelContainer} onClick={onClose}>
            <span className={styles.cancelX}>×</span>
            <span className={styles.cancelText}>Скасувати</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmAppointment;
