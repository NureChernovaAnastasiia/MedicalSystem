import React from 'react';
import { DateRange } from 'react-date-range';
import { uk } from 'date-fns/locale';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import styles from '../../style/PatientMedicalRecords.module.css';

const DateRangeFilter = ({ dateRange, setDateRange, showCalendar, setShowCalendar }) => {

  const resetDateFilter = () => {
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setShowCalendar(false);
  };

  return (
    <div className={styles.datePickerWrapper}>
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
  );
};

export default DateRangeFilter;

