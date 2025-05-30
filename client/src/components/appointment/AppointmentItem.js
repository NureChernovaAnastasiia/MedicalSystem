import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Context } from '../../index';
import { formatAppointmentDateOnly, formatAppointmentTimeOnly, } from '../../utils/formatDate';
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
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
    fontStyle: 'italic',
    position: 'relative',
    top: '6px',
  },
  plannedButton: {
    background: 'rgba(0, 195, 161, 0.42)',
    borderRadius: '10px',
    color: '#FFFFFF',
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
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '42px',
    color: '#FBDA03',
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
      return '#00C3A1';
    case 'Cancelled':
      return '#FF0000';
    case 'Past':
      return '#A0A0A0';
    default:
      return '#333333';
  }
};

const AppointmentItem = ({ appointment, onDetailsClick }) => {
  const { user } = useContext(Context); 
  const role = user._role;
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
      gridTemplateColumns: isSmallScreen
        ? '1fr'
        : role === 'Admin'
        ? '1.2fr 1.2fr 2.2fr 2.5fr 1fr 1.2fr'
        : '1.2fr 1.2fr 2.5fr 1.2fr 1.3fr',
      padding: isSmallScreen ? '0.5rem' : '6px 1rem',
      gap: isSmallScreen ? '0.5rem' : '1rem',
    },
    patientName: {
      ...baseStyles.patientName,
      fontSize: isSmallScreen ? '16px' : '20px',
    },
    appointmentDate: {
      ...baseStyles.appointmentDate,
      fontSize: isSmallScreen ? '16px' : '18px',
    },
    status: {
      ...baseStyles.status,
      color: getStatusColor(appointment.computed_status),
      fontSize: isSmallScreen ? '14px' : '20px',
    },
  };

  const patient = appointment.Patient || {};
  const doctor = appointment.Doctor || {};

  const renderButton = () => {
    if (role === 'Admin') {
      return (
        <button
          style={baseStyles.pastCancelledButton}
          onClick={() => onDetailsClick(appointment)}
        >
          <span style={baseStyles.questionMark}>?</span>Деталі прийому
        </button>
      );
    }

    const isScheduled = appointment.computed_status === 'Scheduled';
    const btnContent = isScheduled ? 'Внести дані' : (
      <>
        <span style={baseStyles.questionMark}>?</span>Деталі прийому
      </>
    );

    return (
      <NavLink
        to={`${DOCTOR_DETAPPOINTMENT_ROUTE}/${appointment.id}`}
        style={{ textDecoration: 'none' }}
      >
        <button
          style={
            isScheduled
              ? baseStyles.plannedButton
              : baseStyles.pastCancelledButton
          }
        >
          {btnContent}
        </button>
      </NavLink>
    );
  };

  return (
    <div style={combinedStyles.appointmentItem}>
      <span style={combinedStyles.appointmentDate}>
        {formatAppointmentDateOnly(appointment)}
      </span>
      <span style={combinedStyles.appointmentDate}>
        {formatAppointmentTimeOnly(appointment)}
      </span>
      {role === 'Admin' && (
        <span
          style={{
            ...combinedStyles.patientName,
            maxWidth: isSmallScreen ? '100%' : '100%',
            display: 'inline-block',
          }}
        >
          {`${doctor.last_name || ''} ${doctor.first_name || ''} ${doctor.middle_name || ''}`.trim() || '—'}
        </span>
      )}
      <span
          style={{
            ...combinedStyles.patientName,
            maxWidth: isSmallScreen ? '100%' : '100%',
            display: 'inline-block',
          }}
        >
        {`${patient.last_name || ''} ${patient.first_name || ''} ${patient.middle_name || ''}`.trim() || '—'}
      </span>
      <span style={combinedStyles.status}>
        {getStatusLabel(appointment.computed_status)}
      </span>
      {renderButton()}
    </div>
  );
};

export default AppointmentItem;
