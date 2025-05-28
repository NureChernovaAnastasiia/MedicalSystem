import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorPatientMedCard.module.css';

import { fetchPatientData } from '../../http/patientAPI';
import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';
import { fetchPrescriptionsByPatientId } from '../../http/prescriptionAPI';

import PatientCardFull from '../../components/patient/PatientCardFull';
import DiagnosisCard from '../../components/medcard/DiagnosisCard';
import SearchInput from '../../components/options/SearchInput';
import ModalPrescriptionInfo from '../../components/modals/ModalPrescriptionInfo';
import { iconDrugs } from '../../utils/icons';

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

    if (id) {
        getData();
    }
  }, [id]);


  const formatDate = (dateStr) => {
    return dateStr ? new Date(dateStr).toLocaleDateString('uk-UA') : 'Немає даних';
  };

  const filteredDiagnoses = diagnoses.filter(d =>
    (d.diagnosis || '').toLowerCase().includes(searchDiagnosis.toLowerCase())
  );

  const filteredRecipes = recipes.filter(r =>
    (r.medication || '').toLowerCase().includes(searchRecipe.toLowerCase())
  );

  const handleClosePrescriptionModal = () => setSelectedPrescription(null);

  const renderDiagnoses = () => (
    <>
      <div className={styles.searchWrapper}>
        <SearchInput
          placeholder="Введіть назву діагнозу"
          value={searchDiagnosis}
          onChange={setSearchDiagnosis}
        />
      </div>
      <div className={styles.listDiagnosis}>
        {filteredDiagnoses.length > 0 ? (
          filteredDiagnoses.map(({ id, diagnosis, record_date }) => (
            <DiagnosisCard key={id} id={id} diagnosis={diagnosis} record_date={record_date} />
          ))
        ) : (
          <div>Діагнози не знайдені</div>
        )}
      </div>
    </>
  );

  const renderPrescriptions = () => (
    <>
      <div className={styles.searchWrapper}>
        <SearchInput
          placeholder="Введіть назву препарату"
          value={searchRecipe}
          onChange={setSearchRecipe}
        />
      </div>
      <div className={styles.list}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((item, index) => (
            <div key={index} className={styles.tableRow}>
              <img src={iconDrugs} alt="icon" className={styles.prescriptionIcon} />
              <div className={styles.drugName}>{item.medication}</div>
              <div className={styles.dateAssigned}>
                Призначено: {formatDate(item.prescribed_date)}
              </div>
              <div className={styles.dateValid}>
                Діє до: {formatDate(item.prescription_expiration)}
              </div>
              <div
                className={styles.details}
                onClick={() => setSelectedPrescription(item)}
              >
                Детальніше
              </div>
            </div>
          ))
        ) : (
          <div>Рецепти не знайдені</div>
        )}
      </div>
    </>
  );

  if (!patient) return <div>Завантаження даних...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Медична картка</h1>
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
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'diagnoses' ? renderDiagnoses() : renderPrescriptions()}
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