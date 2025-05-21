import React from "react";
import styles from "../../style/modalstyle/ModalAnalysInfo.module.css";

import {
  iconPreparation,
  iconDescription,
  iconTestimony,
} from '../../utils/icons';

const ModalAnalysInfo = ({ onClose, analyse }) => {
  const serviceInfo = analyse?.LabTestInfo || analyse?.MedicalServiceInfo;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <p className={styles.title}>Детальна інформація про послугу</p>
        </div>

        <div className={styles.headerForm}>
          <p className={styles.analysName}>{serviceInfo?.name || '—'}</p>
          <p className={styles.duration}>
            Тривалість виконання:{" "}
            {serviceInfo?.duration_days
              ? `${serviceInfo.duration_days} днів`
              : serviceInfo?.duration_minutes
              ? `${serviceInfo.duration_minutes} хвилин`
              : "—"}
          </p>
        </div>

        <div className={styles.section}>
          <div className={styles.iconTitleWrapper}>
            <img className={styles.icon} src={iconDescription} alt="info" />
            <h3 className={styles.sectionTitle}>Опис</h3>
          </div>
          <p className={styles.description}>
            {serviceInfo?.description || 'Немає опису'}
          </p>
        </div>

        <div className={styles.columns}>
            <div className={styles.column}>
                <div className={styles.columnTitleWrapper}>
                <img className={styles.icon} src={iconPreparation} alt="prep" />
                <h3 className={styles.sectionTitle}>Підготовка до аналізу</h3>
                </div>
                <div className={styles.columnTextWrapper}>
                <p className={styles.text}>
                    {serviceInfo?.preparation || 'Немає даних аналіза'}
                </p>
                </div>
            </div>

            <div className={styles.column}>
                <div className={styles.columnTitleWrapper}>
                <img className={styles.icon} src={iconTestimony} alt="indications" />
                <h3 className={styles.sectionTitle}>Показання</h3>
                </div>
                <div className={styles.columnTextWrapper}>
                <p className={styles.text}>
                    {serviceInfo?.indications || 'Немає даних аналіза'}
                </p>
                </div>
            </div>
        </div>

        <div className={styles.closeButton} onClick={onClose}>
          <span className={styles.closeX}>×</span>
          <span className={styles.closeText}>Закрити</span>
        </div>
      </div>
    </div>
  );
};

export default ModalAnalysInfo;
