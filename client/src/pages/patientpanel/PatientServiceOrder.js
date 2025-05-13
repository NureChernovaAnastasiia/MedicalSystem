import React from 'react';
import styles from '../../style/PatientAnalyseOrder.module.css';

import iconSearch from '../../img/icons/search.png';

const ServiceItem = ({ name, provider, address, price }) => (
  <div className={styles.analyseItem}>
    <span className={styles.analyseName}>{name}</span>
    <span className={styles.labName}>{provider}</span>
    <span className={styles.labAddress}>{address}</span>
    <span className={styles.price}>{price} грн</span>
    <button className={styles.orderButton}>Замовити</button>
  </div>
);

const PatientServiceOrder = () => {
  const services = [
    {
      name: 'Консультація терапевта',
      provider: 'Клініка "Добробут"',
      address: 'Київ, вулиця Сім’ї Ідзиковських, 3',
      price: 600,
    },
    {
      name: 'УЗД серця (ехокардіографія)',
      provider: 'Медичний центр "Оберіг"',
      address: 'Київ, вулиця Зоологічна, 3',
      price: 950,
    },
    {
      name: 'Консультація дерматолога',
      provider: 'Клініка "Лікарня майбутнього"',
      address: 'Львів, вулиця Наукова, 7',
      price: 750,
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Замовлення медичних послуг</h1>
      <p className={styles.subtitle}>
        Оберіть потрібну послугу, вкажіть зручне місце та час для проходження.
      </p>

      <div className={styles.searchGroup}>
        <div className={styles.inputWrapper}>
          <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Введіть назву послуги"
          />
        </div>

        <div className={styles.selectGroup}>
          <select className={styles.select}>
            <option>Місто</option>
          </select>
          <select className={styles.select}>
            <option>Клініка</option>
          </select>
          <select className={styles.select}>
            <option>Сортувати за</option>
          </select>
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>Назва послуги</span>
        <span>Назва закладу</span>
        <span>Адреса закладу</span>
        <span>Ціна</span>
      </div>

      <div className={styles.analyseList}>
        {services.map((service, index) => (
          <ServiceItem
            key={index}
            name={service.name}
            provider={service.provider}
            address={service.address}
            price={service.price}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientServiceOrder;
