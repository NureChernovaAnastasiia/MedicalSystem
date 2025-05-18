import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../index';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import styles from '../../style/PatientMedicalRecords.module.css';
import iconSearch from '../../img/icons/search.png';
import iconDiagnosis from '../../img/icons/diagnosis.png';
import { PATIENT_MEDDETAIL_ROUTE } from '../../utils/consts';

import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';
import { fetchPatientByUserId } from '../../http/patientAPI';

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth()+1).toString().padStart(2, '0')}.${date.getFullYear()}`;
};

const DiagnosisCard = ({ diagnosis, record_date }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <img src={iconDiagnosis} alt="icon" className={styles.iconDiagnosis} />
      <p className={styles.date}>Дата встановлення: {formatDate(record_date)}</p>
    </div>
    <h3 className={styles.cardTitle}>{diagnosis}</h3>
    <NavLink to={PATIENT_MEDDETAIL_ROUTE} className={styles.detailsButton}>
      <span className={styles.cardFooterText}>Деталі хвороби</span>
    </NavLink>
  </div>
);

const PatientMedicalRecords = () => {
  const { user } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPatientData = async () => {
      if (!user?.user?.id) return;
      try {
        setLoading(true);
        const data = await fetchPatientByUserId(user.user.id);
        setPatient(data);
      } catch (err) {
        setError('Не вдалося завантажити дані пацієнта');
      } finally {
        setLoading(false);
      }
    };

    getPatientData();
  }, [user]);

  useEffect(() => {
    if (!patient?.id) return;

    const loadMedicalRecords = async () => {
      try {
        setLoading(true);
        const data = await fetchMedicalRecordsByPatientId(patient.id);
        setDiagnoses(data);
        setError(null);
      } catch (err) {
        setError('Не вдалося завантажити медичні записи');
      } finally {
        setLoading(false);
      }
    };

    loadMedicalRecords();
  }, [patient]);

  const { startDate, endDate } = dateRange[0];

  const filteredDiagnoses = diagnoses.filter(({ diagnosis, record_date }) => {
    const matchDiagnosis = diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const diagDate = new Date(record_date);
    const inRange =
      (!startDate || diagDate >= startDate) &&
      (!endDate || diagDate <= endDate);
    return matchDiagnosis && inRange;
  });

  const sortedDiagnoses = filteredDiagnoses.slice().sort((a, b) => new Date(b.record_date) - new Date(a.record_date));

  const getLabel = () => {
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
          <button onClick={() => setShowCalendar(!showCalendar)} className={styles.dateButton}>
            {getLabel()}
          </button>
          {showCalendar && (
            <div className={styles.dateRangeWrapper}>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                maxDate={new Date()}
                locale={uk}
              />
              <button onClick={resetDateFilter} className={styles.clearDateButton}>
                Скинути фільтр
              </button>
            </div>
          )}
        </div>

        <div className={styles.searchBox}>
          <img src={iconSearch} alt="icon" className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Введіть назву діагнозу"
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {sortedDiagnoses.length > 0 ? (
          sortedDiagnoses.map((diag) => (
            <DiagnosisCard
              key={diag.id}
              diagnosis={diag.diagnosis}
              record_date={diag.record_date}
            />
          ))
        ) : (
          <p className={styles.noResults}>Діагнози не знайдені</p>
        )}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
