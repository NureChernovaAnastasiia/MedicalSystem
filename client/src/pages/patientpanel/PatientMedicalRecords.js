import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import SearchInput from '../../components/options/SearchInput';
import DateRangeFilter from '../../components/options/DateRangeFilter';
import DiagnosisCard from '../../components/medcard/DiagnosisCard';
import Loader from '../../components/elements/Loader';
import styles from '../../style/patientpanel/PatientMedicalRecords.module.css';

import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';
import { fetchPatientByUserId } from '../../http/patientAPI';

const PatientMedicalRecords = () => {
  const { user } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const loadMedicalRecords = useCallback(async () => {
    if (!patient?.id) return;
    try {
      setLoading(true);
      const data = await fetchMedicalRecordsByPatientId(patient.id);
      setDiagnoses(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити медичні записи');
    } finally {
      setLoading(false);
    }
  }, [patient]);

  useEffect(() => {
    loadPatient();
  }, [loadPatient]);

  useEffect(() => {
    loadMedicalRecords();
  }, [loadMedicalRecords]);

  const { startDate, endDate } = dateRange[0];

  const filteredDiagnoses = diagnoses.filter(({ diagnosis, record_date }) => {
    const diagnosisLower = diagnosis.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchByDiagnosis = diagnosisLower.includes(searchLower);

    const recordDate = new Date(record_date);
    const isInDateRange =
      (!startDate || recordDate >= startDate) && (!endDate || recordDate <= endDate);

    return matchByDiagnosis && isInDateRange;
  });

  const sortedDiagnoses = filteredDiagnoses.slice().sort((a, b) => new Date(b.record_date) - new Date(a.record_date));

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мої діагнози</h1>
      <p className={styles.subtitle}>
        Переглядайте історію ваших діагнозів, встановлених лікарями, та їх актуальний стан.
      </p>

      <div className={styles.filterRow}>
        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />    

        <div className={styles.searchBox}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Введіть назву діагнозу" />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {sortedDiagnoses.length ? (
          sortedDiagnoses.map(({ id, diagnosis, record_date }) => (
            <DiagnosisCard key={id} id={id} diagnosis={diagnosis} record_date={record_date} />
          ))
        ) : (
          <p className={styles.noResults}>Діагнози не знайдені</p>
        )}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
