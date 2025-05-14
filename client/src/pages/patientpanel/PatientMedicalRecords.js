import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import styles from '../../style/PatientMedicalRecords.module.css';
import iconSearch from '../../img/icons/search.png';
import iconDiagnosis from '../../img/icons/diagnosis.png';
import { PATIENT_MEDDETAIL_ROUTE } from '../../utils/consts';

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
};

const DiagnosisCard = ({ title, date }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <img src={iconDiagnosis} alt="icon" className={styles.iconDiagnosis} />
      <p className={styles.date}>Дата встановлення: {formatDate(date)}</p>
    </div>
    <h3 className={styles.cardTitle}>{title}</h3>
    <NavLink to={PATIENT_MEDDETAIL_ROUTE} className={styles.detailsButton}>
      <span className={styles.cardFooterText}>Деталі хвороби</span>
    </NavLink>
  </div>
);

const PatientMedicalRecords = () => {
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: 'selection' },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const diagnoses = [
    { title: 'Хронічний бронхіт', date: '2025-02-20' },
    { title: 'Остеохондроз шийного відділу', date: '2024-05-28' },
    { title: 'Гастрит', date: '2023-10-17' },
    { title: 'Гіпертонія', date: '2025-02-20' },
    { title: 'Анемія легкого ступіня', date: '2025-02-20' },
  ];

  const { startDate, endDate } = dateRange[0];

  const filteredDiagnoses = diagnoses.filter(({ title, date }) => {
    const matchTitle = title.toLowerCase().includes(searchTerm.toLowerCase());
    const diagDate = new Date(date);
    const inRange =
      (!startDate || diagDate >= startDate) &&
      (!endDate || diagDate <= endDate);
    return matchTitle && inRange;
  });

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
        {filteredDiagnoses.map((diag, index) => (
          <DiagnosisCard key={index} title={diag.title} date={diag.date} />
        ))}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
