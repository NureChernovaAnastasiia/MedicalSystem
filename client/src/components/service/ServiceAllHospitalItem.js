import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import ModalAnalysInfo from '../modals/ModalAnalysInfo';
import { iconSchedule } from '../../utils/icons';
import { ADMIN_SERVICESCHEDULE_ROUTE } from '../../utils/consts';

const baseStyles = {
  analyseItem: {
    display: 'grid',
    gridTemplateColumns: '6fr 5fr 1fr',
    alignItems: 'center',
    gap: '1rem',
    padding: '10px 1rem',
    background: '#fff',
    borderBottom: '1px solid rgba(0, 195, 161, 0.42)',
  },
  analyseName: {
    fontWeight: 600,
    color: '#00C3A1',
    fontSize: '20px',
    wordBreak: 'break-word',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  doctorName: {
    fontWeight: 400,
    color: '#000',
    fontSize: '18px',
    wordBreak: 'break-word',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  button: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontStyle: 'italic',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
  infoIcon: {
    width: '35px',
    height: '35px',
    objectFit: 'contain',
  },
  editButton: {
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
    marginTop: 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',  
    transition: 'color 0.3s ease',
  },
  cancelButton: {
    background: 'transparent',
    border: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'italic',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    color: '#333333',
    fontWeight: 300,
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: 'auto',
    alignSelf: 'flex-start',
  },
  closeIcon: {
    color: '#FF0000',
    fontSize: '35px',
    fontWeight: 600,
    lineHeight: 1,
  },
  closeText: {
    fontSize: '18px',
  },
};

const smallScreenStyles = {
  analyseItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.75rem',
    display: 'flex',
    padding: '1rem',
  },
  actionButtons: {
    width: '100%',
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: '0.5rem',
  },
  infoIcon:{
    width: '25px',
    height: '25px',
  },
  editButton:{
    fontSize: '16px',
  },
  cancelButton: {
    fontSize: '16px',
  },
  closeIcon: {
    fontSize: '28px',
  },
  closeText: {
    fontSize: '16px',
  },
};

const ServiceAllHospitalItem = ({ service, onDelete }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const name = service.LabTestInfo?.name || service.MedicalServiceInfo?.name || '—';
  const doctorName = `${service.Doctor?.last_name} ${service.Doctor?.first_name} ${service.Doctor?.middle_name}` || '—';

  const combinedStyles = {
    analyseItem: {
      ...baseStyles.analyseItem,
      ...(isSmallScreen ? smallScreenStyles.analyseItem : {}),
    },
    analyseName: baseStyles.analyseName,
    doctorName: baseStyles.doctorName,
    actionButtons: {
      ...baseStyles.actionButtons,
      ...(isSmallScreen ? smallScreenStyles.actionButtons : {}),
    },
    infoIcon:{
      ...baseStyles.infoIcon,
      ...(isSmallScreen ? smallScreenStyles.infoIcon : {}),
    },
    editButton: {
      ...baseStyles.button,
      ...baseStyles.editButton,
      ...(isSmallScreen ? smallScreenStyles.editButton : {}),
    },
    cancelButton: {
      ...baseStyles.cancelButton,
      ...(isSmallScreen ? smallScreenStyles.cancelButton : {}),
    },
    closeIcon: {
      ...baseStyles.closeIcon,
      ...(isSmallScreen ? smallScreenStyles.closeIcon : {}),
    },
    closeText: {
      ...baseStyles.closeText,
      ...(isSmallScreen ? smallScreenStyles.closeText : {}),
    },
  };

  return (
    <>
      <div style={combinedStyles.analyseItem}>
        <span
          style={combinedStyles.analyseName}
          onClick={() => setIsModalOpen(true)}
        >
          {name}
        </span>

        <span style={combinedStyles.doctorName}>{doctorName}</span>

        <div style={combinedStyles.actionButtons}>
          <NavLink to={`${ADMIN_SERVICESCHEDULE_ROUTE}/${service.LabTestInfo ? 'analysis' : 'service'}/${service.id}`}>
            <button style={combinedStyles.editButton}>
              <img src={iconSchedule} alt="Розклад" style={combinedStyles.infoIcon} />
              Розклад
            </button>
          </NavLink>
          <button
            style={combinedStyles.cancelButton}
            onClick={() => onDelete && onDelete(service.id)}
          >
            <span style={combinedStyles.closeIcon}>×</span>
            <span style={combinedStyles.closeText}>Видалити</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ModalAnalysInfo
          onClose={() => setIsModalOpen(false)}
          analyse={service}
        />
      )}
    </>
  );
};

export default ServiceAllHospitalItem;
