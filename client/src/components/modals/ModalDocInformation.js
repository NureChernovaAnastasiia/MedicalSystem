import React from 'react';
import styles from '../../style/modalstyle/ModalDocInformation.module.css';

import specIcon from '../../img/icons/specialisation.png';
import expIcon from '../../img/icons/doctor.png';
import workIcon from '../../img/icons/hospital.png';
import addressIcon from '../../img/icons/location.png';
import bioIcon from '../../img/icons/bio.png';
import contactIcon from '../../img/icons/telephone.png';

const ModalDocInformation = ({ doctor, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.leftPanel}>
          <img src={doctor.image} alt="Doctor" className={styles.doctorImage} />
          <div className={styles.contactGroup}>
            <div className={styles.infoItem}>
            <img src={contactIcon} alt="icon" className={styles.icon} />
            <h3><strong>Контакти:</strong></h3></div>
            <p><strong>E-mail: </strong></p> 
              <p>{doctor.email}</p>
            <p><strong>Телефон: </strong></p> 
              <p>{doctor.phone}</p>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.closeButton} onClick={onClose}>
            <span className={styles.closeIcon}>×</span>
            <span className={styles.closeText}>Закрити</span>
          </div>

          <h1 className={styles.name}>{doctor.name}</h1>

          <div className={styles.infoItem}>
            <img src={specIcon} alt="icon" className={styles.icon} />
            <p><strong>Спеціалізація: </strong> {doctor.specialty}</p>
          </div>

          <div className={styles.infoItem}>
            <img src={expIcon} alt="icon" className={styles.icon} />
            <p><strong>Стаж: </strong> {doctor.experience}</p>
          </div>

          <div className={styles.infoItem}>
            <img src={workIcon} alt="icon" className={styles.icon} />
            <p><strong>Місце роботи: </strong>{doctor.hospital}</p>
          </div>

          <div className={styles.infoItem}>
            <img src={addressIcon} alt="icon" className={styles.icon} />
            <p><strong>Адреса: </strong>{doctor.city}</p>
          </div>

          <div className={styles.bio}>
            <img src={bioIcon} alt="icon" className={styles.icon} />
            <p><strong>Коротка біографія: </strong>"{doctor.bio}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDocInformation;
