import React, { useState } from 'react';
import styles from '../../style/PatientPrescriptions.module.css';

import iconSearch from '../../img/icons/search.png';
import iconDrugs from '../../img/icons/drugs.png';

const prescriptions = [
  { name: 'Будесонід', assigned: '10.03.2025', validUntil: '10.06.2025' },
  { name: 'Сальбутамол', assigned: '10.03.2025', validUntil: '20.03.2025' },
  { name: 'Нурофен', assigned: '03.05.2024', validUntil: '10.05.2024' },
  { name: 'Алмагель', assigned: '03.05.2024', validUntil: '17.05.2024' },
  { name: 'Сорцеф', assigned: '21.01.2024', validUntil: '27.01.2024' },
  { name: 'Біфрен', assigned: '14.07.2023', validUntil: '14.10.2023' },
];

const isActive = (validUntil) => {
  const today = new Date();
  const expiry = new Date(validUntil.split('.').reverse().join('-'));
  return expiry >= today;
};

const PatientPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredPrescriptions = prescriptions.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showActiveOnly ? isActive(item.validUntil) : true;
    return matchesSearch && matchesActive;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Мої рецепти</h1>
      <p className={styles.subtitle}>Ваші активні та попередні рецепти, призначені лікарями.</p>

      <div className={styles.controls}>
        <label className={styles.radioLabel}>
          <input
            type="checkbox"
            id="active-only"
            checked={showActiveOnly}
            onChange={() => setShowActiveOnly(!showActiveOnly)}
          />
          <span>Активні рецепти</span>
        </label>

        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <img src={iconSearch} alt="Search Icon" />
          </div>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Введіть назву препарату"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
        </div>
      </div>

      <div className={styles.tableBody}>
        {filteredPrescriptions.map((item, index) => (
          <div key={index} className={styles.tableRow}>
            <img src={iconDrugs} alt="icon" className={styles.prescriptionIcon} />
            <div className={styles.drugName}>{item.name}</div>
            <div className={styles.dateAssigned}>Призначено: {item.assigned}</div>
            <div className={styles.dateValid}>Діє до: {item.validUntil}</div>
            <div className={styles.details}>Детальніше</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
