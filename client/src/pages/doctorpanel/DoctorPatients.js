import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';
import { format } from 'date-fns';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import SearchInput from '../../components/options/SearchInput';
import DateRangeFilter from '../../components/options/DateRangeFilter';
import PatientItem from '../../components/patient/PatientItem'; 

import styles from '../../style/doctorpanel/DoctorPatients.module.css';

import { fetchDoctorByUserId } from '../../http/doctorAPI';
import { fetchPatientsByDoctorId } from '../../http/patientAPI';

const DoctorPatients = () => {
  const { user } = useContext(Context);
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDoctor = useCallback(async () => {
    if (!user?.user?.id) return;
    try {
      setLoading(true);
      const data = await fetchDoctorByUserId(user.user.id);
      setDoctor(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити дані лікаря');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadPatients = useCallback(async () => {
    if (!doctor?.id) return;
    try {
      setLoading(true);
      const data = await fetchPatientsByDoctorId(doctor.id);
      setPatients(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити пацієнтів');
    } finally {
      setLoading(false);
    }
  }, [doctor]);

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const { startDate, endDate } = dateRange[0];

  const filteredPatients = patients.filter(patient => {
    const fullNameLower = (`${patient.last_name} ${patient.first_name} ${patient.middle_name}` || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const birthDate = patient.birth_date ? new Date(patient.birth_date) : null;

    const matchByName = fullNameLower.includes(searchLower);
    const isInDateRange =
      (!startDate || (birthDate && birthDate >= startDate)) &&
      (!endDate || (birthDate && birthDate <= endDate));

    return matchByName && isInDateRange;
  });

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
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Пацієнти</h1>
        <div className={styles.orderButtonWrapper}>
            <button className={styles.orderButton}>Зарєеструвати пацієнта</button>
        </div>
      </div>
      <p className={styles.subtitle}>
        Переглядайте список пацієнтів, яких веде лікар, та їх основну інформацію.
      </p>

      <div className={styles.filterRow}>
        <div className={styles.datePickerWrapper}>
          <button
            onClick={() => setShowCalendar(prev => !prev)}
            className={styles.dateButton}
          >
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
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Введіть ПІБ пацієнта"
          />
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>ПІБ пацієнта</span>
        <span>Дата народження</span>
        <span>Email</span>
      </div>

      <div className={styles.cardsGrid}>
        {filteredPatients.length ? (
          filteredPatients.map(patient => (
            <PatientItem key={patient.id} patient={patient} />
          ))
        ) : (
          <p className={styles.noResults}>Пацієнтів не знайдено</p>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
