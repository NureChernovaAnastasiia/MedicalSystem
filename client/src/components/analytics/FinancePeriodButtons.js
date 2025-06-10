import React from 'react';
import styles from '../../style/adminpanel/AdminAnalytics.module.css';

export const FinancePeriods = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year'
};

const FinancePeriodButtons = ({ financePeriod, setFinancePeriod }) => {
  const periods = [
    { key: FinancePeriods.DAY, label: 'День' },
    { key: FinancePeriods.MONTH, label: 'Місяць' },
    { key: FinancePeriods.YEAR, label: 'Рік' }
  ];

  return (
    <div className={styles.financeButtons}>
      {periods.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.periodButton} ${financePeriod === key ? styles.activePeriod : ''}`}
          onClick={() => setFinancePeriod(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FinancePeriodButtons;
