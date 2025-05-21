import React, { useEffect, useState, useContext } from 'react';
import styles from '../../style/patientpanel/PatientMedCard.module.css';
import { Context } from '../../index';
import { fetchPatientByUserId } from '../../http/patientAPI';
import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';
import { fetchPrescriptionsByPatientId } from '../../http/prescriptionAPI';

import PatientCard from '../../components/patient/PatientCard';
import DiagnosisPreview from '../../components/medcard/DiagnosisPreview';
import PrescriptionPreview from '../../components/medcard/PrescriptionPreview';

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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Моя медична картка</h1>
      <p className={styles.description}>
        Переглядайте свою історію лікування, призначення лікарів та результати аналізів у зручному форматі.
      </p>

      <PatientCard patient={patient} />

      <div className={styles.contentRow}>
        <DiagnosisPreview diagnoses={diagnoses} />
        <PrescriptionPreview prescriptions={recipes} referenceCount={diagnoses.length} />
      </div>
    </div>
  );
};

export default PatientMedCard;
