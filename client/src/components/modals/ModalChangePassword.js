import React, { useState } from "react";
import { changePassword } from "../../http/userAPI";
import styles from "../../style/modalstyle/ModalChangePassword.module.css";
import AlertPopup from "../../components/elements/AlertPopup";

const ModalChangePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const handleChangePassword = async () => {
    setAlert(null);

    if (newPassword !== confirmPassword) {
      setAlert({ message: "Паролі не співпадають.", type: "error" });
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setAlert({ message: "Пароль успішно змінено!", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onClose();
        setAlert(null);
      }, 1000);
    } catch (err) {
      setAlert({
        message: err.response?.data?.message || "Помилка при зміні пароля.",
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
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>Зміна паролю</h2>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Старий пароль:</label>
            <input
              type="password"
              className={styles.input}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Новий пароль:</label>
            <input
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <p className={styles.rules}>
            * Пароль має містити щонайменше 8 символів, одну велику літеру, одну малу літеру та одну цифру.
          </p>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Підтвердити пароль:</label>
            <input
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={handleChangePassword}>
              ✓ Змінити пароль
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalChangePassword;

