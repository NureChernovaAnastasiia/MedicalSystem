import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientAnalysis.module.css';

const Card = ({ id, status, title, date, clinic, statusClass, footerClass, footerText, isReady, linkTo }) => {
  return (
    <div className={styles.card}>
      <div className={styles.innerCard}>
        <div className={statusClass}>● {status}</div>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardDate}><strong>Дата проведення:</strong> {date}</p>
        <p className={styles.cardClinic}><strong>Клініка:</strong> {clinic}</p>
      </div>
      {isReady ? (
        <NavLink to={linkTo} className={footerClass}>
            <span className={styles.cardFooterText}>{footerText}</span>
        </NavLink>
        ) : (
        <div className={footerClass}>
            <span className={styles.cardFooterText}>{footerText}</span>
        </div>
        )}
    </div>
  );
};

export default Card;

