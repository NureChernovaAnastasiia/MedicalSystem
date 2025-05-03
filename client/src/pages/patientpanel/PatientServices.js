import React from 'react';
import styles from '../../style/PatientAnalysis.module.css';

import iconSearch from '../../img/icons/search.png';

const Card = ({ status, title, date, clinic, statusClass, footerClass, footerText }) => {
  return (
    <div className={styles.card}>
      <div className={styles.innerCard}>
        <div className={statusClass}>● {status}</div>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardDate}><strong>Дата надання:</strong> {date}</p>
        <p className={styles.cardClinic}><strong>Клініка:</strong> {clinic}</p>
      </div>
      <div className={footerClass}>
        <span className={styles.cardFooterText}>{footerText}</span>
      </div>
    </div>
  );
};

const PatientServices = () => {
  const cardData = [
    {
      status: 'Очікується',
      title: 'Флюорографія',
      date: '22.05.2025',
      clinic: 'Клініка “Медіс”, м. Київ',
      statusClass: styles.cardStatusWaiting,
      footerClass: styles.cardFooter,
      footerText: 'Переглянути деталі',
    },
    {
      status: 'Готово',
      title: 'Фізіотерапія (курс процедур)',
      date: '18.04.2025',
      clinic: 'Клініка “Медіс”, м. Київ',
      statusClass: styles.cardStatusReady,
      footerClass: styles.cardFooterReady,
      footerText: 'Переглянути деталі',
    },
    {
      status: 'Очікується',
      title: 'УЗД органів черевної порожнини',
      date: '05.06.2025',
      clinic: 'Клініка “Медіс”, м. Київ',
      statusClass: styles.cardStatusWaiting,
      footerClass: styles.cardFooter,
      footerText: 'Переглянути деталі',
    },
  ];

  return (
    <div className={styles.analysisPage}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Медичні послуги</h1>
        <div className={styles.orderButtonWrapper}>
          <button className={styles.orderButton}>Замовити послугу</button>
        </div>
      </div>

      <p className={styles.subtitle}>
        Ознайомтесь з усіма доступними послугами у клініках.
      </p>

      <div className={styles.searchBar}>
        <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Введіть назву послуги"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.cardsContainer}>
        {cardData.map((card, index) => (
          <Card
            key={index}
            status={card.status}
            title={card.title}
            date={card.date}
            clinic={card.clinic}
            statusClass={card.statusClass}
            footerClass={card.footerClass}
            footerText={card.footerText}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientServices;
