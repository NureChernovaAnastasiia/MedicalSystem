import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconInstructions } from '../../utils/icons';
import { ADMIN_EDITDOCSTAFFDATA_ROUTE } from '../../utils/consts';

const baseStyles = {
  staffItem: {
    background: '#FFFFFF',
    borderWidth: '0 0 1px 0',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 195, 161, 0.42)',
    display: 'grid',
    gridTemplateColumns: '3fr 2.5fr 2.5fr 2fr',
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
  },
  position: {
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

const StaffItem = ({ person }) => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 767);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const combinedStyles = {
    staffItem: {
      ...baseStyles.staffItem,
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
    position: {
      ...baseStyles.position,
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

  const fullName = `${person.last_name || ''} ${person.first_name || ''} ${person.middle_name || ''}`.trim() || '—';

  const handleEditClick = () => {
    navigate(`${ADMIN_EDITDOCSTAFFDATA_ROUTE}/${person.user_id}`, {
      state: { userType: 'Staff' }
    });
  };

  return (
    <>
      <div style={combinedStyles.staffItem}>
        <span style={combinedStyles.fullName}>{fullName}</span>
        <span style={combinedStyles.position}>{person.position || '—'}</span>
        <span style={combinedStyles.email}>{person.email || '—'}</span>
        <button style={combinedStyles.editButton} onClick={handleEditClick}>
          <img src={iconInstructions} alt="Редагувати" style={baseStyles.editIcon} />
          Редагувати дані
        </button>
      </div>

    </>
  );
};

export default StaffItem;
