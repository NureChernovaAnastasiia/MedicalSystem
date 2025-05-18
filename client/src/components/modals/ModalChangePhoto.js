import React from 'react';
import styles from '../../style/modalstyle/ModalChangePhoto.module.css';

const ModalChangePhoto = ({ photoPreview, photoUrl, onClose, onChangePhotoUrl, onUpload }) => {
  return (
    <div className={styles.overlay}>
        <div className={styles.modal}>
            <h2 className={styles.title}>Зміна фото профілю</h2>

            <label className={styles.label} htmlFor="photo-url-input">
            Вставте посилання на нове зображення:
            </label>
            <input
            id="photo-url-input"
            type="text"
            className={styles.input}
            placeholder="https://example.com/photo.jpg"
            value={photoUrl}
            onChange={(e) => onChangePhotoUrl(e.target.value)}
            />

            <div className={styles.bottomSection}>
            <div className={styles.leftControls}>
                <div className={styles.previewSection}>
                <p className={styles.previewLabel}>Попередній перегляд:</p>
                </div>

                <button className={styles.changePhotoButton} onClick={onUpload}>
                <span className={styles.saveIcon}>✓</span>
                <span className={styles.saveText}>Змінити фото</span>
                </button>

                <button className={styles.cancelButton} onClick={onClose}>
                <span className={styles.closeIcon}>×</span>
                <span className={styles.closeText}>Скасувати</span>
                </button>
            </div>

            <div className={styles.photoCircle}>
                {photoPreview ? (
                <img src={photoPreview} alt="Profile" className={styles.photoCircleImage} />
                ) : (
                <div className={styles.noPhotoCircle}>Немає зображення</div>
                )}
            </div>
            </div>
        </div>
        </div>
  );
};

export default ModalChangePhoto;
