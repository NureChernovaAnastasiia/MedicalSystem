import React, { useState, useEffect } from 'react';
import ModalDocInformation from '../modals/ModalDocInformation';
import { iconInstructions } from '../../utils/icons'; 

const baseStyles = {
  doctorItem: {
    background: '#FFFFFF',
    borderWidth: '0 0 1px 0',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 195, 161, 0.42)',
    display: 'grid',
    gridTemplateColumns: '3fr 3fr 3fr 1fr',
    alignItems: 'center',
    padding: '8px 1rem',
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
  specialization: {
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '28px',
    color: '#555555',
  },
  email: {
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '18px',
    lineHeight: '28px',
    color: '#333333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  editButton: {
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'color 0.3s ease',
  },
  editIcon: {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
  },
};

const DoctorItem = ({ doctor }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 767);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const combinedStyles = {
    doctorItem: {
      ...baseStyles.doctorItem,
      ...(isSmallScreen
        ? {
            gridTemplateColumns: '1fr',
            padding: '0.5rem',
            gap: '0.5rem',
          }
        : {}),
    },
    fullName: {
      ...baseStyles.fullName,
      ...(isSmallScreen ? { fontSize: '16px', lineHeight: '22px' } : {}),
    },
    specialization: {
      ...baseStyles.specialization,
      ...(isSmallScreen ? { fontSize: '16px' } : {}),
    },
    email: {
      ...baseStyles.email,
      ...(isSmallScreen ? { fontSize: '16px' } : {}),
    },
    editButton: {
      ...baseStyles.editButton,
      ...(isSmallScreen ? { fontSize: '14px' } : {}),
    },
  };

  const fullName = `${doctor.last_name || ''} ${doctor.first_name || ''} ${doctor.middle_name || ''}`.trim() || '—';

  return (
    <>
      <div style={combinedStyles.doctorItem}>
        <span style={combinedStyles.fullName}>{fullName}</span>
        <span style={combinedStyles.specialization}>{doctor.specialization || '—'}</span>
        <span style={combinedStyles.email}>{doctor.email || '—'}</span>
        <button
          style={combinedStyles.editButton}
          onClick={() => setModalOpen(true)}
          onMouseEnter={e => (e.currentTarget.style.color = '#00795f')}
          onMouseLeave={e => (e.currentTarget.style.color = '#00C3A1')}
          type="button"
        >
          <img src={iconInstructions} alt="Редагувати" style={baseStyles.editIcon} />
          Редагувати дані
        </button>
      </div>

      {modalOpen && <ModalDocInformation doctor={doctor} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default DoctorItem;
