import React, { useState } from 'react';
import styles from '../../style/modalstyle/ModalChangePhoto.module.css';
import { updatePatientPhoto } from '../../http/patientAPI';
import AlertPopup from '../../components/elements/AlertPopup';

const ModalChangePhoto = ({ patientId, initialPhotoUrl = '', onClose, onPhotoUpdated }) => {
  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); 

  const handleUpload = async () => {
    if (!photoUrl.trim()) {
      setAlert({ message: 'Введіть посилання на фото', type: 'error' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const updatedPatient = await updatePatientPhoto(patientId, photoUrl);
      onPhotoUpdated?.(updatedPatient.photo_url);
      setAlert({ message: 'Фото успішно оновлено', type: 'success' });

      setTimeout(() => {
        onClose();
        setAlert(null);
      }, 1000);
    } catch (e) {
      console.error(e);
      setAlert({ message: 'Не вдалося оновити фото', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderPhotoPreview = () => (
    photoUrl ? (
      <img
        src={photoUrl}
        alt="Profile preview"
        className={styles.photoCircleImage}
        onError={() => setAlert({ message: 'Неможливо завантажити зображення', type: 'error' })}
      />
    ) : (
      <div className={styles.noPhotoCircle}>Немає зображення</div>
    )
  );

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
        <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h2 id="modal-title" className={styles.title}>Зміна фото профілю</h2>

          <label className={styles.label} htmlFor="photo-url-input">
            Вставте посилання на нове зображення:
          </label>
          <input
            id="photo-url-input"
            type="text"
            className={styles.input}
            placeholder="https://example.com/photo.jpg"
            value={photoUrl}
            onChange={e => setPhotoUrl(e.target.value)}
            disabled={loading}
            autoFocus
          />

          <div className={styles.bottomSection}>
            <div className={styles.leftControls}>
              <p className={styles.previewLabel}>Попередній перегляд:</p>

              <button
                className={styles.changePhotoButton}
                onClick={handleUpload}
                disabled={loading}
                type="button"
              >
                <span className={styles.saveIcon}>✓</span>
                <span className={styles.saveText}>
                  {loading ? 'Завантаження...' : 'Змінити фото'}
                </span>
              </button>

              <button
                className={styles.cancelButton}
                onClick={onClose}
                disabled={loading}
                type="button"
              >
                <span className={styles.closeIcon}>×</span>
                <span className={styles.closeText}>Скасувати</span>
              </button>
            </div>

            <div className={styles.photoCircle}>
              {renderPhotoPreview()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalChangePhoto;

