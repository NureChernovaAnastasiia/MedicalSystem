import React from 'react';
import styles from '../../style/PatientAnalysis.module.css';

import iconSearch from '../../img/icons/search.png';

const Card = ({ status, title, date, clinic, statusClass, footerClass, footerText }) => {
  return (
    <div className={styles.card}>
      <div className={styles.innerCard}>
        <div className={statusClass}>● {status}</div>
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardDate}><strong>Дата проведення:</strong> {date}</p>
        <p className={styles.cardClinic}><strong>Клініка:</strong> {clinic}</p>
      </div>
      <div className={footerClass}>
        <span className={styles.cardFooterText}>{footerText}</span>
      </div>
    </div>
  );
};

const PatientAnalysis = () => {
  const cardData = [
    {
      status: 'Очікується',
      title: 'Щорічний контроль показників здоров\'я',
      date: '20.04.2025',
      clinic: 'Лабораторія “Синево”, м. Київ',
      statusClass: styles.cardStatusWaiting,
      footerClass: styles.cardFooter,
      footerText: 'Переглянути результат',
    },
    {
      status: 'Готово',
      title: 'Загальний аналіз крові',
      date: '14.01.2025',
      clinic: 'Лабораторія “Синево”, м. Київ',
      statusClass: styles.cardStatusReady,
      footerClass: styles.cardFooterReady,
      footerText: 'Переглянути результат',
    },
    {
      status: 'Очікується',
      title: 'Аналіз на рівень холестерину',
      date: '10.03.2025',
      clinic: 'Лабораторія “Синево”, м. Київ',
      statusClass: styles.cardStatusWaiting,
      footerClass: styles.cardFooter,
      footerText: 'Переглянути результат',
    },
  ];

  return (
    <div className={styles.analysisPage}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Аналізи</h1>
        <div className={styles.orderButtonWrapper}>
          <button className={styles.orderButton}>Замовити аналізи</button>
        </div>
      </div>

      <p className={styles.subtitle}>
        Переглядайте історію своїх лабораторних досліджень та замовляйте нові.
      </p>

      <div className={styles.searchBar}>
        <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Введіть назву аналізу"
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

export default PatientAnalysis;
