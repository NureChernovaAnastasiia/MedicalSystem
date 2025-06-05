import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import { uk } from 'date-fns/locale';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const DateRangeFilter = ({ dateRange, setDateRange, showCalendar, setShowCalendar }) => {
  const [small, setSmall] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const resize = () => setSmall(window.innerWidth <= 1024);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const styles = {
    datePickerWrapper: {
      position: 'relative',
    },
    dateButton: {
      padding: small ? '0.6rem 0.9rem' : '0.7rem 1rem',
      borderRadius: '10px',
      border: '1px solid #ccc',
      background: 'white',
      cursor: 'pointer',
      fontSize: small ? '16px' : '18px',
      fontStyle: 'italic',
      fontWeight: 300,
      color: 'rgba(0, 0, 0, 0.6)',
      lineHeight: small ? '1rem' : '1.75rem',
    },
    dateRangeWrapper: {
      position: 'absolute',
      zIndex: 10,
    },
    clearDateButton: {
      marginTop: 8,
      background: 'rgb(0, 195, 163)',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: 6,
      cursor: 'pointer',
      fontSize: 14,
    },
  };

  const getDateRangeLabel = () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate && !endDate) return 'Виберіть діапазон';
    if (startDate && !endDate) return `Від ${startDate.toLocaleDateString()}`;
    if (!startDate && endDate) return `До ${endDate.toLocaleDateString()}`;
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const resetDateFilter = () => {
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setShowCalendar(false);
  };

  return (
    <div style={styles.datePickerWrapper}>
      <button
        onClick={() => setShowCalendar(prev => !prev)}
        style={styles.dateButton}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#00C3A1';
          e.currentTarget.style.boxShadow = '0 0 5px rgba(0, 195, 161, 0.5)';
          e.currentTarget.style.outline = 'none';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#ccc';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {getDateRangeLabel()}
      </button>
      {showCalendar && (
        <div style={styles.dateRangeWrapper}>
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDateRange([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            maxDate={new Date()}
            locale={uk}
          />
          <button
            style={styles.clearDateButton}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgb(0, 178, 148)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgb(0, 195, 163)')}
            onClick={resetDateFilter}
          >
            Скинути фільтр
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
