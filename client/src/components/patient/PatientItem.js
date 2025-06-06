import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../index';
import { iconMedCard } from '../../utils/icons';
import { ADMIN_PATMEDCARD_ROUTE, DOCTOR_PATMEDCARD_ROUTE } from '../../utils/consts';

const baseStyles = {
  patientItem: {
    background: '#FFFFFF',
    borderWidth: '0px 0px 1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 195, 161, 0.42)',
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 2.8fr 1.5fr',
    alignItems: 'center',
    padding: '4px 1rem',
    gap: '1rem',
    boxSizing: 'border-box',
    fontFamily: "'Montserrat', sans-serif",
  },
  fullName: {
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '28px',
    color: '#333333',
    position: 'relative',
    top: '6px',
  },
  birthDate: {
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '28px',
    color: '#333333',
    position: 'relative',
    top: '6px',
  },
  email: {
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '18px',
    lineHeight: '45px',
    color: '#333333',
    position: 'relative',
    top: '6px',
  },
  viewCardButton: {
    position: 'relative',
    left: '0',
    fontFamily: "'Montserrat', sans-serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '18px',
    lineHeight: '20px',
    color: '#00C3A1',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',

    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',  

    transition: 'color 0.3s ease',
  },
  infoIcon: {
    width: '35px',
    height: '35px',
    objectFit: 'contain',
  },
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const parts = dateString.split('-'); 
  if (parts.length !== 3) return dateString; 
  const [year, month, day] = parts;
  return `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
};

const PatientItem = ({ patient }) => {
  const { user } = useContext(Context);
  const role = user.role;

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 767);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  const route =
    role === 'Admin'
      ? `${ADMIN_PATMEDCARD_ROUTE}/${patient.id}`
      : `${DOCTOR_PATMEDCARD_ROUTE}/${patient.id}`;

  const combinedStyles = {
    patientItem: {
      ...baseStyles.patientItem,
      ...(isSmallScreen
        ? {
            position: 'relative',
            width: '100%',
            height: 'auto',
            gridTemplateColumns: '1fr',
            padding: '0.5rem',
            gap: '0.5rem',
          }
        : {}),
    },
    fullName: {
      ...baseStyles.fullName,
      ...(isSmallScreen
        ? { fontSize: '16px', lineHeight: '22px', width: '100%' }
        : {}),
    },
    birthDate: {
      ...baseStyles.birthDate,
      ...(isSmallScreen ? { fontSize: '16px', width: '100%' } : {}),
    },
    email: {
      ...baseStyles.email,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      ...(isSmallScreen ? { fontSize: '16px', width: '100%' } : {}),
    },
    viewCardButton: {
      ...baseStyles.viewCardButton,
      ...(isSmallScreen ? { width: '100%', height: '40px', fontSize: '14px' } : {}),
    },
  };

  return (
    <>
      <div style={combinedStyles.patientItem}>
        <span style={combinedStyles.fullName}>
          {`${patient.last_name || ''} ${patient.first_name || ''} ${patient.middle_name || ''}` || '—'}</span>
        <span style={combinedStyles.birthDate}>{formatDate(patient.birth_date) || '—'}</span>
        <span style={combinedStyles.email}>{patient.email || '—'}</span>
        <NavLink to={route}>
        <button
            style={combinedStyles.viewCardButton}
            onMouseEnter={e => (e.currentTarget.style.color = '#00795f')}
            onMouseLeave={e => (e.currentTarget.style.color = '#00C3A1')}
        >
            <img src={iconMedCard} alt="Контакти" style={baseStyles.infoIcon} />
            Переглянути медичну картку
        </button>
        </NavLink>
      </div>
    </>
  );
};

export default PatientItem;
