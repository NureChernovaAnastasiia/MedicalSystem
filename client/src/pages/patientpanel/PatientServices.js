import React, { useContext, useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientAnalysis.module.css';

import { iconSearch } from '../../utils/icons';
import { PATIENT_SERVICEDETAILS_ROUTE, PATIENT_SERVICEORDER_ROUTE } from '../../utils/consts';

import { fetchMedicalServicesByPatientId } from '../../http/servicesAPI';
import { fetchPatientByUserId } from '../../http/patientAPI';
import { Context } from '../../index';

import Card from '../../components/service/ServiceCard';
import Loader from '../../components/elements/Loader'; 

const PatientServices = () => {
  const { user } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [services, setServices] = useState([]);
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

  const loadServices = useCallback(async (patientId) => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await fetchMedicalServicesByPatientId(patientId);
      setServices(data);
      setError(null);
    } catch (e) {
      setError('Не вдалося завантажити медичні послуги');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  useEffect(() => {
    if (patient?.id) {
      loadServices(patient.id);
    }
  }, [patient, loadServices]);

  const filteredServices = services.filter(service => {
    const title = service.MedicalServiceSchedule?.HospitalMedicalService?.MedicalServiceInf || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className={styles.analysisPage}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Медичні послуги</h1>
        <div className={styles.orderButtonWrapper}>
          <NavLink to={PATIENT_SERVICEORDER_ROUTE}>
            <button className={styles.orderButton}>Замовити послугу</button>
          </NavLink>
        </div>
      </div>

      <p className={styles.subtitle}>
        Ознайомтесь з усіма доступними послугами у клініках.
      </p>

      <div className={styles.searchBar}>
        <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Введіть назву послуги"
          className={styles.searchInput}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <Loader />}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.cardsContainer}>
        {!loading && filteredServices.length === 0 && <p>Послуги не знайдено</p>}

        {filteredServices.map((service) => {
          const isReady = service.is_ready === true;
          const status = isReady ? 'Готово' : 'Очікується';
          const statusClass = isReady ? styles.cardStatusReady : styles.cardStatusWaiting;
          const footerClass = isReady ? styles.cardFooterReady : styles.cardFooter;
          const footerText = isReady ? 'Переглянути деталі' : 'Очікуйте результатів';

          const title = service.MedicalServiceInfo?.name || `Послуга #${service.id}`;
          const date = service.MedicalServiceSchedule?.appointment_date
            ? new Date(service.MedicalServiceSchedule.appointment_date).toLocaleDateString('uk-UA')
            : 'Не вказано';

          const clinic = service.MedicalServiceSchedule?.HospitalMedicalService?.Hospital?.name || 'Не вказано';

          return (
            <Card
              key={service.id}
              title={title}
              date={date}
              clinic={clinic}
              status={status}
              isReady={isReady}
              statusClass={statusClass}
              footerClass={footerClass}
              footerText={footerText}
              linkTo={`${PATIENT_SERVICEDETAILS_ROUTE}/${service.id}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PatientServices;
