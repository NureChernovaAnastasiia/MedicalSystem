import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientMedCard.module.css';
import {
  iconDate,
  iconGender,
  iconTelephone,
  iconEmail,
  iconAddress,
  iconHospital,
} from '../../utils/icons';
import { PATIENT_EDITPERSONALINFO_ROUTE } from '../../utils/consts';
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

const PatientCard = ({ patient }) => {
  const gender = genderMap[patient.gender] || 'Немає даних';

  const patientInfo = [
    { icon: iconDate, label: 'Дата народження:', value: formatDate(patient.birth_date) },
    { icon: iconGender, label: 'Стать:', value: gender },
    { icon: iconTelephone, label: 'Телефон:', value: patient.phone || 'Немає даних' },
    { icon: iconEmail, label: 'Email:', value: patient.email || 'Немає даних' },
    { icon: iconAddress, label: 'Адреса:', value: patient.address || 'Немає даних' },
    { icon: iconHospital, label: 'Облік у лікарні:', value: patient.Hospital?.name || 'Немає даних' },
  ];

  return (
    <div className={styles.cardShadow}>
      <div className={styles.card}>
        <div className={styles.leftSide}>
          {patient.photo_url ? (
            <img src={patient.photo_url} alt="Patient" className={styles.profileImage} />
          ) : (
            <div className={styles.noPhoto}>Немає фото</div>
          )}
          <NavLink
            to={PATIENT_EDITPERSONALINFO_ROUTE}
            state={{ patient }}
            className={styles.editWarning}
          >
            <span className={styles.exclamation}>!</span>
            <span className={styles.editText}>Редагувати дані</span>
          </NavLink>
        </div>

        <div className={styles.rightSide}>
          <h2 className={styles.name}>
            {`${patient.last_name} ${patient.first_name} ${patient.middle_name || ''}`.trim()}
          </h2>
          {patientInfo.map((info, index) => (
            <div key={index} className={styles.infoGroup}>
              <img src={info.icon} alt="icon" className={styles.icon} />
              <span className={styles.info}>
                <strong>{info.label}</strong>{' '}
                <span className={styles.lightText}>{info.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;

