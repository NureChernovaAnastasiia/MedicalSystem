import React from 'react';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';

const ServiceList = ({ items, onInfoClick, onOrderClick }) => {
  if (!items || items.length === 0) return <p>Немає даних для відображення</p>;

  return (
    <div className={styles.scrollableList}>
      <div className={styles.scrollContent}>
        {items.map((item) => {
          const isMedical = !!item.MedicalServiceInfo;
          const serviceInfo = isMedical ? item.MedicalServiceInfo : item.LabTestInfo;

          const title = serviceInfo?.name || 'Без назви';
          const priceValue = serviceInfo?.price;
          const price = priceValue != null ? `${Math.round(priceValue)} грн` : 'Ціна відсутня';

          return (
            <div key={item.id} className={styles.itemCard}>
              <div onClick={() => onInfoClick(item)}>{title}</div>
              <div>{price}</div>
              <button className={styles.orderButton} onClick={() => onOrderClick(item)}>Замовити</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceList;
