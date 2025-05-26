import React, { useContext } from 'react';
import { Context } from '../../index';

const baseStyles = {
  scrollableList: {
    flex: 1,
    height: '250px',
    background: '#fff',
    border: '1px solid #D9D9D9',
    borderRadius: '5px',
    overflowY: 'auto',
  },
  scrollContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '10px',
  },
  itemCard: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 1fr',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px',
    gap: '0 10px',
    borderBottom: '1px solid rgba(0, 195, 161, 0.42)',
  },
  fullWidth: {
    gridTemplateColumns: '3fr 1fr',
  },
  title: {
    color: '#00C3A1',
    fontWeight: 600,
    fontSize: '18px',
    cursor: 'pointer',
  },
  price: {
    fontSize: '16px',
    fontWeight: 300,
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#000',
  },
  priceFullWidth: {
    fontSize: '18px',
    lineHeight: 2,
    fontWeight: 300,
    fontStyle: 'normal',
    textAlign: 'center',
    color: '#000',
  },
  orderButton: {
    backgroundColor: '#00C3A1',
    opacity: '42%',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 12px',
    fontStyle: 'italic',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

const ServiceList = ({ items, onInfoClick, onOrderClick }) => {
  const { user } = useContext(Context);
  const userRole = user._role || '';

  if (!items || items.length === 0) {
    return <p>Немає даних для відображення</p>;
  }

  return (
    <div style={baseStyles.scrollableList}>
      <div style={baseStyles.scrollContent}>
        {items.map((item) => {
          const isMedical = !!item.MedicalServiceInfo;
          const serviceInfo = isMedical ? item.MedicalServiceInfo : item.LabTestInfo;

          const title = serviceInfo?.name || 'Без назви';
          const priceValue = serviceInfo?.price;
          const price = priceValue != null ? `${Math.round(priceValue)} грн` : 'Ціна відсутня';

          const showOrderButton = userRole === 'Patient';

          const cardStyle = {
            ...baseStyles.itemCard,
            ...(showOrderButton ? {} : baseStyles.fullWidth),
          };

          const priceStyle = showOrderButton ? baseStyles.price : baseStyles.priceFullWidth;

          return (
            <div key={item.id} style={cardStyle}>
              <div style={baseStyles.title} onClick={() => onInfoClick(item)}>
                {title}
              </div>
              <div style={priceStyle}>{price}</div>
              {showOrderButton && (
                <button style={baseStyles.orderButton} onClick={() => onOrderClick(item)}>
                  Замовити
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceList;
