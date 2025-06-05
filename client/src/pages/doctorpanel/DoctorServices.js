import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import SearchInput from '../../components/options/SearchInput';
import DateRangeFilter from '../../components/options/DateRangeFilter';
import ServiceItem from '../../components/service/ServiceItem';

import styles from '../../style/doctorpanel/DoctorServices.module.css';

import { fetchDoctorByUserId } from '../../http/doctorAPI';
import { fetchLabTestsByDoctorId } from '../../http/analysisAPI';
import { fetchMedicalServicesByDoctorId } from '../../http/servicesAPI';

const DoctorServices = () => {
  const { user } = useContext(Context);
  const [services, setServices] = useState([]);
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDoctorServices = useCallback(async (doctorId) => {
    try {
      const [labTests, medicalServices] = await Promise.all([
        fetchLabTestsByDoctorId(doctorId),
        fetchMedicalServicesByDoctorId(doctorId),
      ]);

      const formattedLabTests = labTests.map(test => ({
        ...test,
        type: 'labTest',
        appointment_date: test.appointment_date, 
      }));

      const formattedMedical = medicalServices.map(ms => ({
        ...ms,
        type: 'medicalService',
        appointment_date: ms.MedicalServiceSchedule?.appointment_date, 
      }));

      setServices([...formattedLabTests, ...formattedMedical]);
    } catch (err) {
      console.error('Помилка при завантаженні послуг:', err);
      setError('Не вдалося завантажити послуги лікаря');
    }
  }, []);

  useEffect(() => {
    if (!user?.user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const doctorData = await fetchDoctorByUserId(user.user.id);
        await loadDoctorServices(doctorData.id);
      } catch (err) {
        setError('Не вдалося отримати дані лікаря');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.user?.id, loadDoctorServices]);

  const { startDate, endDate } = dateRange[0];

  const filteredServices = services
  .filter(service => {
    const fullName = service.type === 'lab'
      ? service.patient_name
      : `${service.Patient?.last_name || ''} ${service.Patient?.first_name || ''}`.trim();

    const matchesName = fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const date = new Date(service.appointment_date);

    const isInRange =
      (!startDate || date >= startDate) &&
      (!endDate || date <= endDate);

    let typeMatch = true;
    if (typeFilter !== 'all') {
      typeMatch = service.type === typeFilter;
    }

    return matchesName && isInRange && typeMatch;

  })
  .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Послуги</h1>
      </div>

      <div className={styles.fullWidthSearch}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Введіть ПІБ пацієнта"
        />
      </div>

      <div className={styles.filterRow}>
        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />

        <select
          className={styles.select}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">Усі типи</option>
          <option value="labTest">Лабораторні аналізи</option>
          <option value="medicalService">Медичні послуги</option>
        </select>
      </div>

      <div className={styles.tableHeader}>
        <span>Послуга</span>
        <span>ПІБ пацієнта</span>
        <span>Дата</span>
        <span>Час</span>
      </div>

      <div className={styles.cardsGrid}>
        {loading && <p className={styles.loading}>Завантаження...</p>}
      {error && !loading && <p className={styles.error}>{error}</p>}
      {!loading && !error && services.length === 0 && (
        <p className={styles.noResults}>Послуг не знайдено</p>
      )}
      {!loading && !error && services.length > 0 && (
        <div className={styles.cardsGrid}>
          {filteredServices.map((service, index) => (
            <ServiceItem key={`${service.id}_${index}`} service={service} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default DoctorServices;
