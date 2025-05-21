import React from 'react';
import styles from '../../style/modalstyle/ModalDocInformation.module.css';

import {
  iconSpecialisation,
  iconDoctor,
  iconHospital,
  iconLocation,
  iconBio,
  iconTelephone,
} from '../../utils/icons';


const ModalDocInformation = ({ doctor, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const getExperienceYears = (startDateString) => {
    if (!startDateString) return null;
    const startDate = new Date(startDateString);
    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();

    const m = now.getMonth() - startDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < startDate.getDate())) {
      years--;
    }

    return years;
  };

  const formatYearsWithLabel = (years) => {
    if (years === null) return 'Невідомо';
    const mod10 = years % 10;
    const mod100 = years % 100;

    let label = 'років';
    if (mod10 === 1 && mod100 !== 11) label = 'рік';
    else if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) label = 'роки';

    return `${years} ${label}`;
  };

  const experienceYears = getExperienceYears(doctor.experience_start_date);
  const formattedExperience = formatYearsWithLabel(experienceYears);

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.leftPanel}>
          {doctor.photo_url ? (
            <img src={doctor.photo_url} alt="Doctor" className={styles.doctorImage} />
          ) : (
            <div className={styles.noPhotoCircle}>Немає фото</div>
          )}
          <div className={styles.contactGroup}>
            <div className={styles.infoItem}>
            <img src={iconTelephone} alt="icon" className={styles.icon} />
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

          <h1 className={styles.name}>{`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}</h1>

          <div className={styles.infoItem}>
            <img src={iconSpecialisation} alt="icon" className={styles.icon} />
            <p><strong>Спеціалізація: </strong> {doctor.specialization}</p>
          </div>

          <div className={styles.infoItem}>
            <img src={iconDoctor} alt="icon" className={styles.icon} />
            <p><strong>Стаж: </strong> {formattedExperience}</p>
          </div>

          <div className={styles.infoItem}>
            <img src={iconHospital} alt="icon" className={styles.icon} />
            <p><strong>Місце роботи: </strong>{doctor.Hospital?.name}</p>
          </div>

          <div className={styles.infoItem}>
            <img src={iconLocation} alt="icon" className={styles.icon} />
            <p><strong>Адреса: </strong>{doctor.Hospital?.address}</p>
          </div>

          <div className={styles.bio}>
            <img src={iconBio} alt="icon" className={styles.icon} />
            <p><strong>Коротка біографія: </strong>"{doctor.bio}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDocInformation;
