import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';
import { iconSpecialisation, iconDoctor, iconSchedule, iconEmail } from '../../utils/icons';
import { PATIENT_DOCSCHEDULE_ROUTE } from '../../utils/consts';
import { Context } from '../../index';

const InfoItem = ({ icon, label }) => (
  <div className={styles.infoItem}>
    <img src={icon} alt="Info Icon" className={styles.infoIcon} />
    <p>{label}</p>
  </div>
);

const DoctorCard = ({ doctor, onDetailsClick }) => {
  const { user } = useContext(Context);
  const userRole = user._role || '';

  const experienceYears = doctor.experience_start_date
    ? new Date().getFullYear() - new Date(doctor.experience_start_date).getFullYear()
    : '—';

  return (
    <div className={styles.doctorCard}>
      <div className={styles.cardHeader}>
        <button
          className={styles.detailsButton}
          onClick={onDetailsClick}
        >
          <span>?</span>
        </button>
      </div>

      <img src={doctor.photo_url} alt="Doctor" className={styles.doctorImage} />

      <div className={styles.doctorInfo}>
        <h2 className={styles.doctorName}>
          {doctor.last_name} {doctor.first_name} {doctor.middle_name}
        </h2>

        <InfoItem icon={iconSpecialisation} label={`Спеціальність: ${doctor.specialization}`} />
        <InfoItem icon={iconDoctor} label={`Стаж: ${experienceYears} років`} />

        <div className={styles.infoItem}>
          <img
            src={userRole === 'Patient' ? iconSchedule : iconEmail}
            alt={userRole === 'Patient' ? 'Schedule Icon' : 'Mail Icon'}
            className={styles.buttonIcon}
          />
          {userRole === 'Patient' ? (
            <NavLink
              to={`${PATIENT_DOCSCHEDULE_ROUTE}/${doctor.id}`}
              className={styles.scheduleButton}
            >
              Записатися
            </NavLink>
          ) : (
            <a
              href={`mailto:${doctor.email}`}
              className={styles.scheduleButton}
            >
              Написати
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
