import React, { useState, useEffect } from 'react';

const baseStyles = {
  analyseItem: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 2fr 0.5fr 1fr',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    background: '#fff',
    borderBottom: '1px solid rgba(0, 195, 161, 0.42)',
  },
  analyseName: {
    fontWeight: 600,
    color: '#00C3A1',
    fontSize: '1.2rem',
    wordBreak: 'break-word',
  },
  labName: {
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#000',
    fontSize: '1rem',
    wordBreak: 'break-word',
  },
  labAddress: {
    fontWeight: 300,
    fontStyle: 'italic',
    color: '#000',
    fontSize: '1rem',
    wordBreak: 'break-word',
  },
  price: {
    fontWeight: 300,
    fontStyle: 'italic',
    fontSize: '1.2rem',
    color: '#000',
    textAlign: 'center',
  },
  orderButton: {
    padding: '0.5rem 1rem',
    background: 'rgba(0, 195, 161, 0.42)',
    color: '#fff',
    fontWeight: 600,
    fontStyle: 'italic',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
    width: '100%',
    maxWidth: '150px',
    height: '50px',
    justifySelf: 'center',
  },
};

const smallScreenStyles = {
  analyseItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem',
    gap: '0.5rem',
    alignItems: 'flex-start',
  },
  analyseName: {
    fontSize: '1rem',
    width: '100%',
  },
  labName: {
    fontSize: '0.85rem',
    width: '100%',
  },
  labAddress: {
    fontSize: '0.85rem',
    width: '100%',
  },
  price: {
    fontSize: '1rem',
    textAlign: 'left',
    width: '100%',
  },
  orderButton: {
    fontSize: '0.85rem',
    width: '100%',
    maxWidth: '100%',
    height: '40px',
    alignSelf: 'stretch',
  },
};

const AnalyseItem = ({ analyse }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 767);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const combinedStyles = {
    analyseItem: {
      ...baseStyles.analyseItem,
      ...(isSmallScreen ? smallScreenStyles.analyseItem : {}),
    },
    analyseName: {
      ...baseStyles.analyseName,
      ...(isSmallScreen ? smallScreenStyles.analyseName : {}),
    },
    labName: {
      ...baseStyles.labName,
      ...(isSmallScreen ? smallScreenStyles.labName : {}),
    },
    labAddress: {
      ...baseStyles.labAddress,
      ...(isSmallScreen ? smallScreenStyles.labAddress : {}),
    },
    price: {
      ...baseStyles.price,
      ...(isSmallScreen ? smallScreenStyles.price : {}),
    },
    orderButton: {
      ...baseStyles.orderButton,
      ...(isSmallScreen ? smallScreenStyles.orderButton : {}),
    },
  };

  return (
    <div style={combinedStyles.analyseItem}>
      <span style={combinedStyles.analyseName}>{analyse.LabTestInfo?.name || '—'}</span>
      <span style={combinedStyles.labName}>{analyse.Hospital?.name || '—'}</span>
      <span style={combinedStyles.labAddress}>{analyse.Hospital?.address || '—'}</span>
      <span style={combinedStyles.price}>
        {analyse.LabTestInfo?.price ? Math.round(analyse.LabTestInfo.price) : '—'} грн
      </span>
      <button
        style={combinedStyles.orderButton}
        onMouseEnter={e => (e.currentTarget.style.background = '#00c3a1')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0, 195, 161, 0.42)')}
      >
        Замовити
      </button>
    </div>
  );
};

export default AnalyseItem;



