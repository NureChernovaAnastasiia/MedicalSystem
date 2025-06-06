import React, { useEffect, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../index'; 
import SearchInput from '../../components/options/SearchInput';
import DateRangeFilter from '../../components/options/DateRangeFilter';
import ServiceHospitalItem from '../../components/service/ServiceHospitalItem';

import { getMedicalServicesByHospital } from '../../http/servicesAPI';
import { getLabTestsByHospital } from '../../http/analysisAPI';

import styles from '../../style/adminpanel/AdminServices.module.css';
import { ADMIN_SERVICESHOSP_ROUTE } from '../../utils/consts';

const AdminServices = () => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [activeTab, setActiveTab] = useState('analyses');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [services, setServices] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesData, analysesData] = await Promise.all([
          getMedicalServicesByHospital(hospitalId).catch(() => []),
          getLabTestsByHospital(hospitalId).catch(() => []),
        ]);

        setServices(servicesData);
        setAnalyses(analysesData);
      } catch (error) {
        console.error('Помилка завантаження даних:', error);
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      fetchData();
    }
  }, [hospitalId]);

  useEffect(() => {
    if (services.length === 0 && analyses.length > 0) {
      setActiveTab('analyses');
    } else if (analyses.length === 0 && services.length > 0) {
      setActiveTab('services');
    }
  }, [services, analyses]);

  const handleSearch = (item) => {
    const term = searchTerm.toLowerCase();

    const fullName = `${item.doctor_name || ''} ${item.patient_name || ''}`.toLowerCase();
    const title = (item.test_name || item.title || '').toLowerCase();
    const date = item.appointment_date ? new Date(item.appointment_date) : null;

    const inDateRange =
      (!dateRange[0].startDate || (date && date >= dateRange[0].startDate)) &&
      (!dateRange[0].endDate || (date && date <= dateRange[0].endDate));

    return (
      (title.includes(term) || fullName.includes(term)) && inDateRange
    );
  };

  const filteredData = (activeTab === 'services' ? services : analyses)
  .filter(handleSearch)
  .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  if (loading) {
    return <p className={styles.loading}>Завантаження даних...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Послуги</h1>
        <div className={styles.orderButtonWrapper}>
          <NavLink to={ADMIN_SERVICESHOSP_ROUTE}>
            <button className={styles.orderButton}>Список послуг</button>
          </NavLink>
        </div>
      </div>

      <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${activeTab === 'analyses' ? styles.active : ''}`}
          onClick={() => setActiveTab('analyses')}
          disabled={analyses.length === 0} 
        >
          Аналізи
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'services' ? styles.active : ''}`}
          onClick={() => setActiveTab('services')}
          disabled={services.length === 0} 
        >
          Послуги
        </button>
      </div>

      <div className={styles.filterRow}>
          <DateRangeFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />

        <div className={styles.searchBox}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Назва послуги, ПІБ лікаря або пацієнта"
          />
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>Назва</span>
        <span>Лікар</span>
        <span>Пацієнт</span>
        <span>Дата</span>
        <span>Час</span>
      </div>

      <div className={styles.cardsGrid}>
        {filteredData.length ? (
          filteredData.map((item) => (
            <ServiceHospitalItem key={item.id} service={item} />
          ))
        ) : (
          <p className={styles.noResults}>Нічого не знайдено</p>
        )}
      </div>
    </div>
  );
};

export default AdminServices;
