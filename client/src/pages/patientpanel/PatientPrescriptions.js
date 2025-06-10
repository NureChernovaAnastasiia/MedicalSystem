import React, { useState, useEffect, useCallback, useContext } from 'react';
import styles from '../../style/patientpanel/PatientPrescriptions.module.css';
import { iconSearch, iconDrugs } from '../../utils/icons';

import { Context } from '../../index';
import { fetchPrescriptionsByPatientId } from '../../http/prescriptionAPI';
import { fetchPatientByUserId } from '../../http/patientAPI';
import ModalPrescriptionInfo from '../../components/modals/ModalPrescriptionInfo'; 
import Loader from '../../components/elements/Loader';

const isActive = (validUntil) => {
  if (!validUntil) return false;
  const today = new Date();
  const expiry = new Date(validUntil);
  return expiry >= today;
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const PatientPrescriptions = () => {
  const { user } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedPrescription, setSelectedPrescription] = useState(null); 

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

  const loadPrescriptions = useCallback(async () => {
    if (!patient?.id) return;
    try {
      setLoading(true);
      const data = await fetchPrescriptionsByPatientId(patient.id);
      setPrescriptions(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити рецепти');
    } finally {
      setLoading(false);
    }
  }, [patient]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const filteredPrescriptions = prescriptions
    .filter((item) => {
      const matchesSearch = item.medication.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActive = showActiveOnly ? isActive(item.prescription_expiration) : true;
      return matchesSearch && matchesActive;
    })
    .sort((a, b) => new Date(b.prescription_expiration) - new Date(a.prescription_expiration));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мої рецепти</h1>
      <p className={styles.subtitle}>Ваші активні та попередні рецепти, призначені лікарями.</p>

      <div className={styles.controls}>
        <label className={styles.radioLabel}>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />
          <span>Активні рецепти</span>
        </label>

        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <img src={iconSearch} alt="Search Icon" />
          </div>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Введіть назву препарату"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.tableBody}>
          {filteredPrescriptions.map((item, index) => (
            <div key={index} className={styles.tableRow}>
              <img src={iconDrugs} alt="icon" className={styles.prescriptionIcon} />
              <div className={styles.drugName}>{item.medication}</div>
              <div className={styles.dateAssigned}>Призначено: {formatDate(item.prescribed_date)}</div>
              <div className={styles.dateValid}>Діє до: {formatDate(item.prescription_expiration)}</div>
              <div
                className={styles.details}
                onClick={() => setSelectedPrescription(item)} 
              >
                Детальніше
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPrescription && (
        <ModalPrescriptionInfo
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
        />
      )}
    </div>
  );
};

export default PatientPrescriptions;

