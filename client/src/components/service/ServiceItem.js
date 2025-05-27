import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import uk from 'date-fns/locale/uk';
import { DOCTOR_SERVICESRESULT_ROUTE } from '../../utils/consts';

const baseStyles = {
  item: {
    background: '#FFFFFF',
    borderBottom: '1px solid rgba(0, 195, 161, 0.42)',
    display: 'grid',
    gridTemplateColumns: '2.5fr 2.3fr 1.3fr 1.3fr 1.5fr',
    alignItems: 'center',
    padding: '6px 1rem',
    gap: '1rem',
    boxSizing: 'border-box',
    fontFamily: "'Montserrat', sans-serif",
  },
  name: { fontWeight: 500, fontSize: '20px', color: '#333', fontStyle: 'italic' },
  patient: { fontWeight: 500, fontSize: '18px', color: '#333', fontStyle: 'italic' },
  date: { fontWeight: 500, fontSize: '18px', color: '#333', fontStyle: 'italic' },
  time: { fontWeight: 500, fontSize: '18px', color: '#333', fontStyle: 'italic' },
  button: {
    borderRadius: '10px',
    fontFamily: "'Montserrat', sans-serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '16px',
    textAlign: 'center',
    padding: '8px 20px',
    cursor: 'pointer',
    border: 'none',
  },
  addButton: { backgroundColor: 'rgba(0, 195, 161, 0.42)', color: '#fff' },
  viewButton: {
    backgroundColor: '#fff',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  questionMark: { fontWeight: 700, fontSize: '24px', color: '#FBDA03', lineHeight: '1' },
};

const formatDate = (dateString) => {
  return format(parseISO(dateString), 'dd.MM.yyyy', { locale: uk });
};

const formatTime = (timeString) => {
  return format(parseISO(timeString), 'HH:mm', { locale: uk });
};

const ServiceItem = ({ service }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const isLabTest = service.test_name !== undefined;

  const name = isLabTest
    ? service.test_name
    : service.MedicalServiceInfo?.name || '—';

  const patientName = isLabTest
    ? service.patient_name
    : `${service.Patient?.last_name || ''} ${service.Patient?.first_name || ''}`.trim();

  const date = isLabTest
    ? service.appointment_date
    : service.MedicalServiceSchedule?.appointment_date;

  const startTime = isLabTest
    ? service.start_time
    : service.MedicalServiceSchedule?.start_time;

  const endTime = isLabTest
    ? service.end_time
    : service.MedicalServiceSchedule?.end_time;

  const isReady = service.is_ready;

  const serviceType = isLabTest ? 'lab-test' : 'medical-service';

  const renderButton = () => {
    if (!isReady) {
      return (
        <button style={{ ...baseStyles.button, ...baseStyles.addButton }}>
          Додати результат
        </button>
      );
    }
    return (
      <button style={{ ...baseStyles.button, ...baseStyles.viewButton }}>
        <span style={baseStyles.questionMark}>?</span>
        Переглянути результат
      </button>
    );
  };

  useEffect(() => {
    const updateScreen = () => {
      setIsSmallScreen(window.innerWidth <= 767);
    };

    updateScreen();
    window.addEventListener('resize', updateScreen);
    return () => window.removeEventListener('resize', updateScreen);
  }, []);

  const combinedStyles = {
    item: {
      ...baseStyles.item,
      ...(isSmallScreen && {
        gridTemplateColumns: '1fr',
        padding: '0.5rem',
        gap: '0.5rem',
      }),
    },
    name: { ...baseStyles.name, ...(isSmallScreen && { fontSize: '16px' }) },
    patient: { ...baseStyles.patient, ...(isSmallScreen && { fontSize: '14px' }) },
    date: { ...baseStyles.date, ...(isSmallScreen && { fontSize: '14px' }) },
    time: { ...baseStyles.time, ...(isSmallScreen && { fontSize: '14px' }) },
  };

  return (
    <div style={combinedStyles.item}>
      <span style={combinedStyles.name}>{name}</span>
      <span style={combinedStyles.patient}>{patientName}</span>
      <span style={combinedStyles.date}>{formatDate(date)}</span>
      <span style={combinedStyles.time}>
        {startTime && endTime
          ? `${formatTime(startTime)} - ${formatTime(endTime)}`
          : startTime
          ? formatTime(startTime)
          : '—'}
      </span>
      <NavLink
        to={`${DOCTOR_SERVICESRESULT_ROUTE}/${serviceType}/${service.id}`}
        style={{ textDecoration: 'none' }}
      >
        {renderButton()}
      </NavLink>
    </div>
  );
};

export default ServiceItem;
