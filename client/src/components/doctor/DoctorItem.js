import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalDocInformation from '../modals/ModalDocInformation';
import { iconInstructions } from '../../utils/icons'; 
import { ADMIN_EDITDOCSTAFFDATA_ROUTE } from '../../utils/consts';

const baseStyles = {
  doctorItem: {
    background: '#FFFFFF',
    borderWidth: '0 0 1px 0',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 195, 161, 0.42)',
    display: 'grid',
    gridTemplateColumns: '4fr 1.5fr 2.5fr 2fr',
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
    cursor: 'pointer',
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
    width: '30px',
    height: '30px',
    objectFit: 'contain',
  },
};

const DoctorItem = ({ doctor }) => {
  const navigate = useNavigate();
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

  const handleEditClick = () => {
    navigate(`${ADMIN_EDITDOCSTAFFDATA_ROUTE}/${doctor.user_id}`, { state: { userType: 'Doctor' } });
  };

  return (
    <>
      <div style={combinedStyles.doctorItem}>
        <span style={combinedStyles.fullName}
          onClick={() => setModalOpen(true)}
          type="button">
            {fullName}
        </span>
        <span style={combinedStyles.specialization}>{doctor.specialization || '—'}</span>
        <span style={combinedStyles.email}>{doctor.email || '—'}</span>
        <button style={combinedStyles.editButton} onClick={handleEditClick}>
          <img src={iconInstructions} alt="Редагувати" style={baseStyles.editIcon} />
          Редагувати дані
        </button>
      </div>

      {modalOpen && <ModalDocInformation doctor={doctor} onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default DoctorItem;
