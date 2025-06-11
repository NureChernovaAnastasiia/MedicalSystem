import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchPatientData } from '../../http/patientAPI';
import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';
import { fetchPrescriptionsByPatientId } from '../../http/prescriptionAPI';

import PatientCardFull from '../../components/patient/PatientCardFull';
import TabButtons from '../../components/navbars/TabButtons';
import ModalPrescriptionInfo from '../../components/modals/ModalPrescriptionInfo';
import Loader from '../../components/elements/Loader';
import DiagnosesSection from '../../components/medcard/DiagnosesSection';
import PrescriptionsSection from '../../components/medcard/PrescriptionsSection';

import styles from '../../style/doctorpanel/DoctorPatientMedCard.module.css';

const AdminPatientMedCard = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('diagnoses');
  const [searchDiagnosis, setSearchDiagnosis] = useState('');
  const [searchRecipe, setSearchRecipe] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const patientData = await fetchPatientData(id);
        setPatient(patientData);

        const medicalRecords = await fetchMedicalRecordsByPatientId(id);
        setDiagnoses(medicalRecords.sort((a, b) => new Date(b.record_date) - new Date(a.record_date)));

        const prescriptions = await fetchPrescriptionsByPatientId(id);
        setRecipes(prescriptions.sort((a, b) => new Date(b.prescribed_date) - new Date(a.prescribed_date)));
      } catch (error) {
        console.error('Помилка при отриманні даних:', error);
      }
    };

    if (id) getData();
  }, [id]);

  const handleClosePrescriptionModal = () => setSelectedPrescription(null);

  if (!patient) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Медична картка</h1>
      </div>

      <PatientCardFull patient={patient} diagnoses={diagnoses} recipes={recipes} />

      <div className={styles.contentRow}>
        <TabButtons
          tabs={[
            { key: 'diagnoses', label: 'Діагнози' },
            { key: 'recipes', label: 'Рецепти' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className={styles.tabContent}>
          {activeTab === 'diagnoses' ? (
            <DiagnosesSection
              diagnoses={diagnoses}
              searchValue={searchDiagnosis}
              onSearchChange={setSearchDiagnosis}
            />
          ) : (
            <PrescriptionsSection
              prescriptions={recipes}
              searchValue={searchRecipe}
              onSearchChange={setSearchRecipe}
              onDetailsClick={setSelectedPrescription}
            />
          )}
        </div>
      </div>

      {selectedPrescription && (
        <ModalPrescriptionInfo
          prescription={selectedPrescription}
          onClose={handleClosePrescriptionModal}
        />
      )}
    </div>
  );
};

export default AdminPatientMedCard;
