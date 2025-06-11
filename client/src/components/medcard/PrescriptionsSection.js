import React from 'react';
import SearchInput from '../options/SearchInput';
import { formatDate } from '../../utils/formatDate';
import { iconDrugs } from '../../utils/icons';
import styles from '../../style/doctorpanel/DoctorPatientMedCard.module.css';

const PrescriptionsSection = ({ prescriptions, searchValue, onSearchChange, onDetailsClick }) => {
  const filteredRecipes = prescriptions.filter(r =>
    (r.medication || '').toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className={styles.searchWrapper}>
        <SearchInput
          placeholder="Введіть назву препарату"
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
      <div className={styles.list}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((item, index) => (
            <div key={index} className={styles.tableRow}>
              <img src={iconDrugs} alt="icon" className={styles.prescriptionIcon} />
              <div className={styles.drugName}>{item.medication}</div>
              <div className={styles.dateAssigned}>
                Призначено: {formatDate(item.prescribed_date)}
              </div>
              <div className={styles.dateValid}>
                Діє до: {formatDate(item.prescription_expiration)}
              </div>
              <div
                className={styles.details}
                onClick={() => onDetailsClick(item)}
              >
                Детальніше
              </div>
            </div>
          ))
        ) : (
          <div>Рецепти не знайдені</div>
        )}
      </div>
    </>
  );
};

export default PrescriptionsSection;
