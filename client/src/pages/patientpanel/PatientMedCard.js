import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/PatientMedCard.module.css';

import iconDate from '../../img/icons/calendar.png';
import iconGender from '../../img/icons/gender.png';
import iconTelephone from '../../img/icons/telephone.png';
import iconEmail from '../../img/icons/email.png';
import iconAddress from '../../img/icons/address.png';
import iconHospital from '../../img/icons/hospital.png';

import {
  PATIENT_EDITPERSONALINFO_ROUTE,
  PATIENT_MEDDETAIL_ROUTE,
  PATIENT_MEDRECORDS_ROUTE,
  PATIENT_PRESCRIPTIONS_ROUTE
} from '../../utils/consts';

import { Context } from '../../index'; 
import { fetchPatientByUserId } from '../../http/patientAPI';
import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';
import { fetchPrescriptionsByPatientId } from '../../http/prescriptionAPI';

const PatientMedCard = () => {
  const { user } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const getPatientData = async () => {
      if (!user?.user?.id) return;
      try {
        const data = await fetchPatientByUserId(user.user.id);
        setPatient(data);

        const medicalRecords = await fetchMedicalRecordsByPatientId(data.id);
        setDiagnoses(medicalRecords);

        const prescriptions = await fetchPrescriptionsByPatientId(data.id);
        setRecipes(prescriptions);
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
      }
    };

    getPatientData();
  }, [user]);

  if (!patient) {
    return <div>Завантаження даних пацієнта...</div>;
  }

  const sortedDiagnoses = Array.isArray(diagnoses)
    ? [...diagnoses].sort((a, b) => new Date(b.record_date) - new Date(a.record_date))
    : [];

  const sortedRecipes = Array.isArray(recipes)
    ? [...recipes].sort((a, b) => new Date(b.prescription_date) - new Date(a.prescription_date))
    : [];

  const patientInfo = [
    { icon: iconDate, label: 'Дата народження:', value: patient.date_of_birth || 'Немає даних' },
    { icon: iconGender, label: 'Стать:', value: patient.gender || 'Немає даних' },
    { icon: iconTelephone, label: 'Телефон:', value: patient.phone || 'Немає даних' },
    { icon: iconEmail, label: 'Email:', value: patient.email || 'Немає даних' },
    { icon: iconAddress, label: 'Адреса:', value: patient.address || 'Немає даних' },
    { icon: iconHospital, label: 'Облік у лікарні:', value: patient.Hospital?.name || 'Немає даних' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Моя медична картка</h1>
      <p className={styles.description}>
        Переглядайте свою історію лікування, призначення лікарів та результати аналізів у зручному форматі.
      </p>

      <div className={styles.cardShadow}>
        <div className={styles.card}>
          <div className={styles.leftSide}>
            {patient.photo ? (
              <img src={patient.photo} alt="Patient" className={styles.profileImage} />
            ) : (
              <div className={styles.noPhoto}>Немає фото</div>
            )}
            <NavLink to={PATIENT_EDITPERSONALINFO_ROUTE} className={styles.editWarning}>
              <span className={styles.exclamation}>!</span>
              <span className={styles.editText}>Редагувати дані</span>
            </NavLink>
          </div>

          <div className={styles.rightSide}>
            <h2 className={styles.name}>
              {`${patient.first_name} ${patient.last_name} ${patient.middle_name || ''}`.trim()}
            </h2>
            {patientInfo.map((info, index) => (
              <div key={index} className={styles.infoGroup}>
                <img src={info.icon} alt="icon" className={styles.icon} />
                <span className={styles.info}>
                  <strong>{info.label}</strong> <span className={styles.lightText}>{info.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.contentRow}>
        <div className={styles.diagnosisColumn}>
          <h2 className={styles.sectionTitle}>Діагнози</h2>
          {sortedDiagnoses.length === 0 && <p>Діагнози відсутні</p>}
          {sortedDiagnoses.slice(0, 4).map((diagnosis, index) => (
            <div key={index} className={styles.diagnosisItem}>
              <p className={styles.diagnosisText}>{diagnosis.diagnosis}</p>
              <p className={styles.diagnosisDate}>
                {new Date(diagnosis.record_date).toLocaleDateString('uk-UA')}
              </p>
              <NavLink to={PATIENT_MEDDETAIL_ROUTE} className={styles.detailsButton}>
                Детальніше
              </NavLink>
            </div>
          ))}
          <NavLink to={PATIENT_MEDRECORDS_ROUTE} className={styles.viewAll}>
            <span className={styles.viewAllText}>Переглянути всі діагнози ›</span>
          </NavLink>
        </div>

        <div className={styles.recipeColumn}>
          <h2 className={styles.sectionTitle}>Рецепти</h2>
          {sortedRecipes.length === 0 && <p>Рецепти відсутні</p>}
          <div className={styles.recipeGrid}>
            {sortedRecipes.slice(0, Math.max(1, diagnoses.length+2)).map((recipe, index) => (
              <div key={index} className={styles.recipeItem}>{recipe.medication}</div>
            ))}
          </div>
          <NavLink to={PATIENT_PRESCRIPTIONS_ROUTE} className={styles.viewAll}>
            <span className={styles.viewAllText}>Всі рецепти ›</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default PatientMedCard;
