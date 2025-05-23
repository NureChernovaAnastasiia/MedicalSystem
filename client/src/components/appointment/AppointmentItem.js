import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  formatAppointmentDateOnly,
  formatAppointmentTimeOnly,
} from '../../utils/formatDate';
import { DOCTOR_DETAPPOINTMENT_ROUTE } from '../../utils/consts';

const baseStyles = {
  appointmentItem: {
    background: '#FFFFFF',
    borderWidth: '0px 0px 1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 195, 161, 0.42)',
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.2fr 2.5fr 1.2fr 1.3fr',
    alignItems: 'center',
    padding: '6px 1rem',
    gap: '1rem',
    boxSizing: 'border-box',
    fontFamily: "'Montserrat', sans-serif",
  },
  patientName: {
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: '20px',
    color: '#333333',
    position: 'relative',
    top: '6px',
  },
  appointmentDate: {
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '28px',
    color: '#333333',
    position: 'relative',
    top: '6px',
  },
  status: {
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',
    position: 'relative',
    fontFamily: "'Montserrat', sans-serif",
    fontStyle: 'italic',
    alignItems: 'center',
    top: '6px',
  },
  plannedButton: {
    background: 'rgba(0, 195, 161, 0.42)',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontFamily: "'Montserrat', sans-serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '18px',
    textAlign: 'center',
    padding: '8px 20px',
    margin: '5px 14px',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  pastCancelledButton: {
    background: '#FFFFFF',
    borderRadius: '10px',
    color: '#333333',
    fontFamily: "'Montserrat', sans-serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '18px',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4px',
  },
  questionMark: {
    fontFamily: "'Montserrat', sans-serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '42px',
    color: '#FBDA03',
    position: 'relative',
  },
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'Scheduled':
      return 'Заплановано';
    case 'Cancelled':
      return 'Скасовано';
    case 'Past':
      return 'Минулий';
    default:
      return '—';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled':
      return '#00C3A1'; // зелений
    case 'Cancelled':
      return '#FF0000'; // червоний
    case 'Past':
      return '#A0A0A0'; // сірий
    default:
      return '#333333';
  }
};

const AppointmentItem = ({ appointment }) => {
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
    appointmentItem: {
      ...baseStyles.appointmentItem,
      ...(isSmallScreen && {
        gridTemplateColumns: '1fr',
        padding: '0.5rem',
        gap: '0.5rem',
      }),
    },
    patientName: {
      ...baseStyles.patientName,
      ...(isSmallScreen && { fontSize: '16px', lineHeight: '22px' }),
    },
    appointmentDate: {
      ...baseStyles.appointmentDate,
      ...(isSmallScreen && { fontSize: '16px' }),
    },
    status: {
      ...baseStyles.status,
      color: getStatusColor(appointment.computed_status),
      ...(isSmallScreen && { fontSize: '14px' }),
    },
    viewCardButton: {
      ...baseStyles.viewCardButton,
      ...(isSmallScreen && { width: '100%', height: '40px', fontSize: '14px' }),
    },
  };

  const patient = appointment.Patient || {};

  const renderButton = () => {
    if (appointment.computed_status === 'Scheduled') {
      return <button style={baseStyles.plannedButton}>Внести дані</button>;
    }
    if (appointment.computed_status === 'Past' || appointment.computed_status === 'Cancelled') {
      return (
        <button style={baseStyles.pastCancelledButton}>
          <span style={baseStyles.questionMark}>?</span>
          Деталі прийому
        </button>
      );
    }
    return null;
  };

  return (
    <div style={combinedStyles.appointmentItem}>
      <span style={combinedStyles.appointmentDate}>
        {formatAppointmentDateOnly(appointment)}
      </span>
      <span style={combinedStyles.appointmentDate}>
        {formatAppointmentTimeOnly(appointment)}
      </span>
      <span style={combinedStyles.patientName}>
        {`${patient.last_name || ''} ${patient.first_name || ''} ${patient.middle_name || ''}`.trim() || '—'}
      </span>
      <span style={combinedStyles.status}>
        {getStatusLabel(appointment.computed_status)}
      </span>
      <NavLink to={`${DOCTOR_DETAPPOINTMENT_ROUTE}/${appointment.id}`} style={{ textDecoration: 'none' }}>
        {renderButton()}
      </NavLink>
    </div>
  );
};

export default AppointmentItem;
