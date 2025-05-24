import React from 'react';
import styles from '../../style/doctorpanel/DoctorPatientMedCard.module.css';
import {
  iconDate,
  iconGender,
  iconTelephone,
  iconEmail,
  iconAddress,
  iconHospital,
  iconHealth,
} from '../../utils/icons';
import { genderMap } from '../../constants/gender';

const formatDate = (dateStr) => {
  if (!dateStr) return 'Немає даних';
  const date = new Date(dateStr);
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const InfoRow = ({ icon, label, value }) => (
  <div className={styles.infoGroup}>
    <img src={icon} alt={label} className={styles.icon} />
    <span className={styles.info}>
      <strong>{label}</strong>{' '}
      <span className={styles.lightText}>{value || 'Немає даних'}</span>
    </span>
  </div>
);

const PatientCardFull = ({ patient }) => {
  const gender = genderMap[patient.gender] || 'Немає даних';
  const fullName = `${patient.last_name} ${patient.first_name} ${patient.middle_name || ''}`.trim();

  const basicInfo = [
    { icon: iconDate, label: 'Дата народження', value: formatDate(patient.birth_date) },
    { icon: iconGender, label: 'Стать', value: gender },
    { icon: iconTelephone, label: 'Телефон', value: patient.phone },
    { icon: iconEmail, label: 'Email', value: patient.email },
    { icon: iconAddress, label: 'Адреса', value: patient.address },
    { icon: iconHospital, label: 'Облік у лікарні', value: patient.Hospital?.name },
  ];

  const healthInfo = [
    { label: 'Група крові', value: patient.blood_type },
    { label: 'Алергії', value: patient.allergie },
    { label: 'Хронічні захворювання', value: patient.chronic_conditions },
  ];

  return (
    <div className={styles.cardShadow}>
      <div className={styles.card}>
        <div className={styles.topSection}>
          <div className={styles.leftSide}>
            {patient.photo_url ? (
              <img
                src={patient.photo_url}
                alt="Patient"
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.noPhoto}>Немає фото</div>
            )}
          </div>

          <div className={styles.rightSide}>
            <h2 className={styles.name}>{fullName}</h2>
            {basicInfo.map(({ icon, label, value }) => (
              <InfoRow key={label} icon={icon} label={label} value={value} />
            ))}
          </div>
        </div>

        <div className={styles.healthSection}>
          <h3 className={styles.healthTitle}>
            <img src={iconHealth} alt="health" className={styles.healthIcon} />
            Інформація про здоров’я
          </h3>

          <div className={styles.healthItemsRow}>
            {healthInfo.map(({ label, value }) => (
              <div key={label} className={styles.healthItem}>
                <strong>{label}:</strong>{' '}
                <span className={styles.lightText}>{value || 'Немає даних'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCardFull;
