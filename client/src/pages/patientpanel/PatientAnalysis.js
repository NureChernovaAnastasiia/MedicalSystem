import React, { useContext, useState, useEffect, useCallback } from 'react';
import styles from '../../style/patientpanel/PatientAnalysis.module.css';
import { NavLink } from 'react-router-dom';

import { iconSearch } from '../../utils/icons';
import { PATIENT_ANALYSEDETAIL_ROUTE, PATIENT_ANALYSEORDER_ROUTE } from '../../utils/consts';

import { fetchLabTestsByPatientId } from '../../http/analysisAPI'; 
import { fetchPatientByUserId } from '../../http/patientAPI';  
import { Context } from '../../index';

import Card from '../../components/service/ServiceCard'; 
import Loader from '../../components/elements/Loader';

const PatientAnalysis = () => {
  const { user } = useContext(Context);

  const [patient, setPatient] = useState(null);  
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPatient = useCallback(async () => {
    if (!user?.user?.id) return;
    try {
      setLoading(true);
      const data = await fetchPatientByUserId(user.user.id);
      setPatient(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити дані пацієнта');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadLabTests = useCallback(async (patientId) => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await fetchLabTestsByPatientId(patientId);
      setLabTests(data);
      setError(null);
    } catch (e) {
      setError('Не вдалося завантажити аналізи');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  useEffect(() => {
    if (patient?.id) {
      loadLabTests(patient.id);
    }
  }, [patient, loadLabTests]);

  const filteredLabTests = labTests.filter(test => {
    const testTitle = test.LabTestSchedule?.hospital_lab_service_id?.toString() || ''; 
    return testTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.analysisPage}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Аналізи</h1>
        <div className={styles.orderButtonWrapper}>
          <NavLink to={PATIENT_ANALYSEORDER_ROUTE}>
            <button className={styles.orderButton}>Замовити аналізи</button>
          </NavLink>
        </div>
      </div>

      <p className={styles.subtitle}>
        Переглядайте історію своїх лабораторних досліджень та замовляйте нові.
      </p>

      <div className={styles.searchBar}>
        <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Введіть назву аналізу"
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <Loader />}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.cardsContainer}>
        {!loading && filteredLabTests.length === 0 && <p>Аналізи не знайдено</p>}

        {filteredLabTests.map((test) => {
          const isReady = test.is_ready;
          const status = isReady ? 'Готово' : 'Очікується';
          const statusClass = isReady ? styles.cardStatusReady : styles.cardStatusWaiting;
          const footerClass = isReady ? styles.cardFooterReady : styles.cardFooter;
          const footerText = isReady ? 'Переглянути деталі' : 'Очікуйте результатів';

          const date = test.LabTestSchedule?.appointment_date
            ? new Date(test.LabTestSchedule.appointment_date).toLocaleDateString('uk-UA')
            : 'Не вказано';

          const clinic = test.Doctor?.Hospital?.name || 'Не вказано';
          const title = test.LabTestSchedule?.HospitalLabService?.LabTestInfo?.name || `Аналіз #${test.id}`;

          return (
            <Card
              key={test.id}
              title={title}
              date={date}
              clinic={clinic}
              status={status}
              isReady={isReady}
              statusClass={statusClass}
              footerClass={footerClass}
              footerText={footerText}
              linkTo={`${PATIENT_ANALYSEDETAIL_ROUTE}/${test.id}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PatientAnalysis;
