import React, { useEffect, useState } from 'react';
import styles from '../../style/PatientAnalyseOrder.module.css';

import iconSearch from '../../img/icons/search.png';
import { getHospitalLabServices } from '../../http/analysisAPI';

const AnalyseItem = ({ name, lab, address, price }) => (
  <div className={styles.analyseItem}>
    <span className={styles.analyseName}>{name}</span>
    <span className={styles.labName}>{lab}</span>
    <span className={styles.labAddress}>{address}</span>
    <span className={styles.price}>{price} грн</span>
    <button className={styles.orderButton}>Замовити</button>
  </div>
);

const PatientAnalyseOrder = () => {
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHospitalLabServices();
        const mapped = data.map(item => ({
          name: item.LabTestInfo.name,
          lab: item.Hospital.name,
          address: item.Hospital.address,
          price: Math.round(item.LabTestInfo.price), 
        }));
        setAnalyses(mapped);
      } catch (error) {
        console.error('Помилка при завантаженні аналізів:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Замовлення лабораторних аналізів</h1>
      <p className={styles.subtitle}>
        Оберіть потрібний аналіз, вкажіть зручне місце та час для проходження.
      </p>

      <div className={styles.searchGroup}>
        <div className={styles.inputWrapper}>
          <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Введіть назву аналізу"
          />
        </div>

        <div className={styles.selectGroup}>
          <select className={styles.select}>
            <option>Місто</option>
          </select>
          <select className={styles.select}>
            <option>Лікарня</option>
          </select>
          <select className={styles.select}>
            <option>Сортувати за</option>
          </select>
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>Назва аналізу</span>
        <span>Назва лабораторії</span>
        <span>Адреса лабораторії</span>
        <span>Ціна</span>
      </div>

      <div className={styles.analyseList}>
        {analyses.map((analyse, index) => (
          <AnalyseItem
            key={index}
            name={analyse.name}
            lab={analyse.lab}
            address={analyse.address}
            price={analyse.price}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientAnalyseOrder;

