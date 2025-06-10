import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientMedicalDetail.module.css';

import { iconDoctor, iconHospital } from '../../utils/icons';

import { fetchMedicalRecordById } from '../../http/medicalRecordAPI';
import { fetchPatientData } from '../../http/patientAPI';  

import ModalPrescriptionInfo from '../../components/modals/ModalPrescriptionInfo';
import Loader from '../../components/elements/Loader'; 

const DoctorMedicalDetail = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [patient, setPatient] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const medicalData = await fetchMedicalRecordById(id);
        setRecord(medicalData);

        const patientId = medicalData.patient_id || medicalData.Patient?.id;
        if (patientId) {
          const patientData = await fetchPatientData(patientId);
          setPatient(patientData);
        } else {
          setError('Не вдалося визначити пацієнта для цього діагнозу');
        }
      } catch {
        setError('Не вдалося завантажити дані діагнозу або пацієнта');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const goBack = () => navigate(-1);
  const openModal = (prescription) => setSelectedPrescription(prescription);
  const closeModal = () => setSelectedPrescription(null);
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('uk-UA');

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!record) return <div>Діагноз не знайдено</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Детальна інформація про діагноз</h1>

      <div className={styles.diagnosisHeader}>
        <h2 className={styles.diagnosisTitle}>{record.diagnosis}</h2>
        <p className={styles.diagnosisDate}>
          Дата встановлення: {formatDate(record.record_date)}
        </p>
      </div>

      <div className={styles.doctorNotesSection}>
        <div className={styles.leftColumn}>
          <div className={styles.detailItem}>
            <img src={iconDoctor} alt="Patient Icon" className={styles.icon} />
            <p className={styles.detailText}>
              <strong>Пацієнт:</strong>{' '}
              {patient
                ? `${patient.last_name} ${patient.first_name} ${patient.middle_name || ''}`.trim()
                : 'Завантаження...'}
            </p>
          </div>
          <div className={styles.detailItem}>
            <img
              src={iconHospital}
              alt="Hospital Icon"
              className={styles.icon}
            />
            <p className={styles.detailText}>
              <strong>Заклад:</strong>{' '}
              {patient?.Hospital?.name || 'Невідомо'}
            </p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <h3 className={styles.notesTitle}>Записи лікаря</h3>
          <div className={styles.recommendationsBox}>
            <p className={styles.recommendations}>
              Рекомендації:
              <br />
              {record.treatment
                .split(/\r?\n/)
                .map((item, index) =>
                  item.trim() ? (
                    <React.Fragment key={index}>
                      – {item.trim()}
                      <br />
                    </React.Fragment>
                  ) : null
                )}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.prescriptionsSection}>
        <h3 className={styles.prescriptionsTitle}>Призначені препарати</h3>
        <div className={styles.prescriptionsList}>
          {record.Prescriptions?.length > 0 ? (
            record.Prescriptions.map((prescription) => (
              <div
                className={styles.medicineCard}
                key={prescription.id}
                onClick={() => openModal(prescription)}
              >
                <strong>{prescription.medication}</strong>
              </div>
            ))
          ) : (
            <p>Препарати не призначено</p>
          )}
        </div>
      </div>

      <button onClick={goBack} className={styles.backButton}>
        ‹ Повернутися назад
      </button>

      {selectedPrescription && (
        <ModalPrescriptionInfo
          prescription={selectedPrescription}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default DoctorMedicalDetail;
