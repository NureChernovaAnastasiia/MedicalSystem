import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/elementsstyle/DoctorCard.module.css';
import { PATIENT_DOCSCHEDULE_ROUTE } from '../../utils/consts';
import iconSpecialisation from '../../img/icons/specialisation.png';
import iconHospital from '../../img/icons/hospital.png';
import iconLocation from '../../img/icons/location.png';
import iconSchedule from '../../img/icons/schedule.png';

const DoctorCard = ({ doctor, onOpenModal }) => (
  <div className={styles.doctorCard}>
    <div className={styles.cardHeader}>
      <button className={styles.detailsButton} onClick={() => onOpenModal(doctor)}>
        <span>?</span> Детальніше про лікаря
      </button>
    </div>
    {doctor.photo_url ? (
      <img src={doctor.photo_url} alt="Doctor" className={styles.doctorImage} />
    ) : (
      <div className={styles.noPhotoCircle}>Немає фото</div>
    )}
    <div className={styles.doctorInfo}>
      <h2 className={styles.doctorName}>
        {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}
      </h2>
      <div className={styles.infoItem}>
        <img src={iconSpecialisation} alt="Спеціальність" className={styles.infoIcon} />
        <p><strong>Спеціальність:</strong> {doctor.specialization}</p>
      </div>
      <div className={styles.infoItem}>
        <img src={iconHospital} alt="Лікарня" className={styles.infoIcon} />
        <p><strong>Лікарня:</strong> {doctor.Hospital?.name}</p>
      </div>
      <div className={styles.infoItem}>
        <img src={iconLocation} alt="Місто" className={styles.infoIcon} />
        <p><strong>Місто:</strong> {doctor.Hospital?.address}</p>
      </div>
      <div className={styles.infoItem}>
        <img src={iconSchedule} alt="Розклад" className={styles.buttonIcon} />
        <NavLink to={PATIENT_DOCSCHEDULE_ROUTE} className={styles.scheduleButton}>
          Переглянути розклад
        </NavLink>
      </div>
    </div>
  </div>
);

export default DoctorCard;
