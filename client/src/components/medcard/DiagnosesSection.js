import React from 'react';
import SearchInput from '../options/SearchInput';
import DiagnosisCard from './DiagnosisCard';
import styles from '../../style/doctorpanel/DoctorPatientMedCard.module.css';

const DiagnosesSection = ({ diagnoses, searchValue, onSearchChange }) => {
  const filteredDiagnoses = diagnoses.filter(d =>
    (d.diagnosis || '').toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <div className={styles.searchWrapper}>
        <SearchInput
          placeholder="Введіть назву діагнозу"
          value={searchValue}
          onChange={onSearchChange}
        />
      </div>
      <div className={styles.listDiagnosis}>
        {filteredDiagnoses.length > 0 ? (
          filteredDiagnoses.map(({ id, diagnosis, record_date }) => (
            <DiagnosisCard key={id} id={id} diagnosis={diagnosis} record_date={record_date} />
          ))
        ) : (
          <div>Діагнози не знайдені</div>
        )}
      </div>
    </>
  );
};

export default DiagnosesSection;
