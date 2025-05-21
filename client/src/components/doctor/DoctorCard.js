import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PATIENT_DOCSCHEDULE_ROUTE } from '../../utils/consts';
import {
  iconSpecialisation,
  iconHospital,
  iconLocation,
  iconSchedule
} from '../../utils/icons';

const baseStyles = {
  doctorCard: {
    width: '100%',
    maxWidth: '1276px',
    margin: '20px auto',
    padding: '20px 40px',
    background: '#ffffff',
    border: '1px solid #d9d9d9',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    boxSizing: 'border-box',
    position: 'relative',
  },
  cardHeader: {
    position: 'absolute',
    top: '10px',
    right: '20px',
  },
  detailsButton: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 300,
    fontSize: '16px',
    color: '#333333',
    cursor: 'pointer',
  },
  detailsIcon: {
    marginRight: '8px',
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: '30px',
    lineHeight: 1,
    color: '#FBDA03',
  },
  doctorImage: {
    flexShrink: 0,
    width: '20%',
    maxWidth: '280px',
    aspectRatio: '1/1',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  noPhotoCircle: {
    flexShrink: 0,
    width: '20%',
    maxWidth: '280px',
    aspectRatio: '1/1',
    borderRadius: '50%',
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#edece6',
    color: '#00C3A1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 auto',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  doctorInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  doctorName: {
    margin: '10px 0',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 500,
    fontSize: '26px',
    color: '#333333',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'italic',
    fontWeight: 200,
    fontSize: '18px',
    color: '#333333',
  },
  infoIcon: {
    width: '40px',
    height: '40px',
  },
  scheduleButton: {
    height: '40px',
    padding: '5px 20px',
    background: 'rgba(0, 195, 161, 0.42)',
    border: 'none',
    borderRadius: '10px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
    fontSize: '16px',
    color: '#333333',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const smallScreenStyles = {
  doctorCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
    padding: '20px',
  },
  doctorImage: {
    width: '50%',
    maxWidth: '200px',
    alignSelf: 'center',
  },
  noPhotoCircle: {
    width: '50%',
    maxWidth: '200px',
    alignSelf: 'center',
    fontSize: '14px',
  },
  doctorName: {
    textAlign: 'center',
    fontSize: '24px',
  },
  infoItem: {
    fontSize: '16px',
  },
};

const DoctorCard = ({ doctor, onOpenModal }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 767);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const mergedStyles = {
    doctorCard: {
      ...baseStyles.doctorCard,
      ...(isSmallScreen ? smallScreenStyles.doctorCard : {}),
    },
    doctorImage: {
      ...baseStyles.doctorImage,
      ...(isSmallScreen ? smallScreenStyles.doctorImage : {}),
    },
    noPhotoCircle: {
      ...baseStyles.noPhotoCircle,
      ...(isSmallScreen ? smallScreenStyles.noPhotoCircle : {}),
    },
    doctorName: {
      ...baseStyles.doctorName,
      ...(isSmallScreen ? smallScreenStyles.doctorName : {}),
    },
    infoItem: {
      ...baseStyles.infoItem,
      ...(isSmallScreen ? smallScreenStyles.infoItem : {}),
    },
  };

  return (
    <div style={mergedStyles.doctorCard}>
      <div style={baseStyles.cardHeader}>
        <button style={baseStyles.detailsButton} onClick={() => onOpenModal(doctor)}>
          <span style={baseStyles.detailsIcon}>?</span> Детальніше про лікаря
        </button>
      </div>
      {doctor.photo_url ? (
        <img src={doctor.photo_url} alt="Doctor" style={mergedStyles.doctorImage} />
      ) : (
        <div style={mergedStyles.noPhotoCircle}>Немає фото</div>
      )}
      <div style={baseStyles.doctorInfo}>
        <h2 style={mergedStyles.doctorName}>
          {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}
        </h2>
        <div style={mergedStyles.infoItem}>
          <img src={iconSpecialisation} alt="Спеціальність" style={baseStyles.infoIcon} />
          <p><strong>Спеціальність:</strong> {doctor.specialization}</p>
        </div>
        <div style={mergedStyles.infoItem}>
          <img src={iconHospital} alt="Лікарня" style={baseStyles.infoIcon} />
          <p><strong>Лікарня:</strong> {doctor.Hospital?.name}</p>
        </div>
        <div style={mergedStyles.infoItem}>
          <img src={iconLocation} alt="Місто" style={baseStyles.infoIcon} />
          <p><strong>Місто:</strong> {doctor.Hospital?.address}</p>
        </div>
        <div style={mergedStyles.infoItem}>
          <img src={iconSchedule} alt="Розклад" style={baseStyles.infoIcon} />
          <NavLink to={`${PATIENT_DOCSCHEDULE_ROUTE}/${doctor.id}`} style={baseStyles.scheduleButton}>
            Переглянути розклад
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;

