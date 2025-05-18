import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';
import { format } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import SearchInput from '../../components/elements/SearchInput';
import DateRangeFilter from '../../components/elements/DateRangeFilter';
import DiagnosisCard from '../../components/elements/DiagnosisCard';
import styles from '../../style/PatientMedicalRecords.module.css';

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

  const getDateRangeLabel = () => {
    if (!startDate && !endDate) return 'Виберіть діапазон';
    if (startDate && !endDate) return `Від ${format(startDate, 'dd.MM.yyyy')}`;
    if (!startDate && endDate) return `До ${format(endDate, 'dd.MM.yyyy')}`;
    return `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`;
  };

  const resetDateFilter = () => {
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setShowCalendar(false);
  };

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мої діагнози</h1>
      <p className={styles.subtitle}>
        Переглядайте історію ваших діагнозів, встановлених лікарями, та їх актуальний стан.
      </p>

      <div className={styles.filterRow}>
        <div className={styles.datePickerWrapper}>
          <button onClick={() => setShowCalendar((prev) => !prev)} className={styles.dateButton}>
            {getDateRangeLabel()}
          </button>
          {showCalendar && (
            <div className={styles.dateRangeWrapper}>
              <DateRangeFilter
                dateRange={dateRange}
                setDateRange={setDateRange}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
              />
              <button onClick={resetDateFilter} className={styles.clearDateButton}>
                Скинути фільтр
              </button>
            </div>
          )}
        </div>

        <div className={styles.searchBox}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Введіть назву діагнозу" />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {sortedDiagnoses.length ? (
          sortedDiagnoses.map(({ id, diagnosis, record_date }) => (
            <DiagnosisCard key={id} diagnosis={diagnosis} record_date={record_date} />
          ))
        ) : (
          <p className={styles.noResults}>Діагнози не знайдені</p>
        )}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
