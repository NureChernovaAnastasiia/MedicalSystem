import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorPatientMedCard.module.css';

import { fetchPatientData } from '../../http/patientAPI';
import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';
import { fetchPrescriptionsByPatientId } from '../../http/prescriptionAPI';
import { fetchDoctorByUserId, fetchDoctorById } from '../../http/doctorAPI';

import { Context } from '../../index';

import PatientCardFull from '../../components/patient/PatientCardFull';
import ModalMedRecordCreation from '../../components/modals/ModalMedRecordCreation';
import ModalPrescriptionInfo from '../../components/modals/ModalPrescriptionInfo';
import ModalCreateAppointment from '../../components/modals/ModalCreateAppointment';
import DiagnosesSection from '../../components/medcard/DiagnosesSection';
import PrescriptionsSection from '../../components/medcard/PrescriptionsSection';
import Loader from '../../components/elements/Loader';

const DoctorPatientMedCard = () => {
  const { id } = useParams();
  const { user } = useContext(Context);

  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [activeTab, setActiveTab] = useState('diagnoses');
  const [searchDiagnosis, setSearchDiagnosis] = useState('');
  const [searchRecipe, setSearchRecipe] = useState('');

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
        try {
        const { id: doctorId } = await fetchDoctorByUserId(user.user.id);
        const doctorData = await fetchDoctorById(doctorId);
        setDoctor(doctorData);

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

    if (id && user?.user?.id) {
        getData();
    }
  }, [id, user]);

  const handleCreateRecord = (newRecord) => {
    setDiagnoses(prev => [newRecord, ...prev]);
    setShowModal(false);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleClosePrescriptionModal = () => setSelectedPrescription(null);

  const handleOpenAppointmentModal = () => setShowAppointmentModal(true);
  const handleCloseAppointmentModal = () => setShowAppointmentModal(false);

  const handleCreate = (newAppointment) => {
    setShowAppointmentModal(false);
  };

  if (!patient || !doctor) return <Loader />;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Медична картка</h1>
        <div className={styles.orderButtonWrapper}>
          <button className={styles.orderButton} onClick={handleOpenAppointmentModal}>Назначити прийом</button>
        </div>
      </div>

      <PatientCardFull patient={patient} diagnoses={diagnoses} recipes={recipes} />

      <div className={styles.contentRow}>
        <div className={styles.tabs}>
          <div className={styles.leftTabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'diagnoses' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('diagnoses')}
            >
              Діагнози
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'recipes' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('recipes')}
            >
              Рецепти
            </button>
          </div>
          <button className={styles.addButton} onClick={handleOpenModal}>
            + Додати
          </button>
        </div>

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

      {showAppointmentModal && (
        <ModalCreateAppointment
          doctorId={doctor.id}
          onClose={handleCloseAppointmentModal}
          onCreate={handleCreate} 
          defaultPatient={patient} 
        />
      )}

      {showModal && (
        <ModalMedRecordCreation
          patientId={patient.id}
          doctorId={doctor.id}
          onClose={handleCloseModal}
          onCreate={handleCreateRecord}
        />
      )}

      {selectedPrescription && (
        <ModalPrescriptionInfo
          prescription={selectedPrescription}
          onClose={handleClosePrescriptionModal}
        />
      )}
    </div>
  );
};

export default DoctorPatientMedCard;
