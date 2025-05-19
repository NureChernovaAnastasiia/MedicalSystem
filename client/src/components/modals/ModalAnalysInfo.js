import React from "react";
import styles from "../../style/modalstyle/ModalAnalysInfo.module.css";

import {
  iconPreparation,
  iconDescription,
  iconTestimony,
} from '../../utils/icons';

const ModalAnalysInfo = ({ onClose, analyse }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <p className={styles.title}>Детальна інформація про аналіз</p>
        </div>

        <div className={styles.headerForm}>
          <p className={styles.analysName}>{analyse?.LabTestInfo?.name || '—'}</p>
          <p className={styles.duration}>
            Тривалість виконання: {analyse?.LabTestInfo?.duration_days || '—'} день(ів)
          </p>
        </div>

        <div className={styles.section}>
            <div className={styles.iconTitleWrapper}>
                <img className={styles.icon} src={iconDescription} alt="info" />
                <h3 className={styles.sectionTitle}>Опис</h3>
            </div>
            <p className={styles.description}>
                {analyse?.LabTestInfo?.description || 'Немає опису аналіза'}
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
                    {analyse?.LabTestInfo?.preparation || 'Немає даних аналіза'}
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
                    {analyse?.LabTestInfo?.indications || 'Немає даних аналіза'}
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
