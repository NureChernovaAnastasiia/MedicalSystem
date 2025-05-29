import React, { useState, useEffect } from 'react';
import ModalEditAdmin from '../modals/ModalEditAdmin';
import { iconHospital, iconLocation, iconEmail, iconTelephone } from '../../utils/icons';

const baseStyles = {
  adminCard: {
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
  adminInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  adminName: {
    margin: '10px 0',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 500,
    fontSize: '26px',
    color: '#333333',
  },
  positionText: {
    fontFamily: 'Montserrat, sans-serif',
    fontStyle: 'italic',
    fontWeight: 300,
    fontSize: '18px',
    color: '#555555',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 200,
    fontSize: '20px',
    color: '#333333',
  },
  infoIcon: {
    width: '40px',
    height: '40px',
  },
};

const smallScreenStyles = {
  adminCard: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
    padding: '20px',
  },
  noPhotoCircle: {
    width: '50%',
    maxWidth: '200px',
    alignSelf: 'center',
    fontSize: '14px',
  },
  adminName: {
    textAlign: 'center',
    fontSize: '24px',
  },
  infoItem: {
    fontSize: '16px',
  },
  positionText: {
    textAlign: 'center',
  },
};

const AdminCard = ({ admin }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminData, setAdminData] = useState(admin);

  useEffect(() => {
    setAdminData(admin); 
  }, [admin]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 767);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const mergedStyles = {
    adminCard: {
      ...baseStyles.adminCard,
      ...(isSmallScreen ? smallScreenStyles.adminCard : {}),
    },
    noPhotoCircle: {
      ...baseStyles.noPhotoCircle,
      ...(isSmallScreen ? smallScreenStyles.noPhotoCircle : {}),
    },
    adminName: {
      ...baseStyles.adminName,
      ...(isSmallScreen ? smallScreenStyles.adminName : {}),
    },
    infoItem: {
      ...baseStyles.infoItem,
      ...(isSmallScreen ? smallScreenStyles.infoItem : {}),
    },
    positionText: {
      ...baseStyles.positionText,
      ...(isSmallScreen ? smallScreenStyles.positionText : {}),
    },
  };

  const positionTranslations = {
  'admin': 'Адміністратор',
  'doctor': 'Лікар',
  'nurse': 'Медсестра',
};

   const handleSave = (updatedData) => {
    setAdminData(prev => ({
      ...prev,
      ...updatedData,
    }));
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div style={mergedStyles.adminCard}>
      <div style={baseStyles.cardHeader}>
        <button style={baseStyles.detailsButton} onClick={handleOpenModal}>
            <span style={baseStyles.detailsIcon}>!</span> Редагувати дані
        </button>
      </div>
      <div style={mergedStyles.noPhotoCircle}>АДМІН</div>
      <div style={baseStyles.adminInfo}>
        <h2 style={mergedStyles.adminName}>
          {`${adminData.last_name || ""} ${adminData.first_name || ""} ${adminData.middle_name || ""}` || 'Адміністратор'}
        </h2>
        <p style={mergedStyles.positionText}>
            {positionTranslations[adminData.position?.toLowerCase()] || adminData.position || 'Посада не вказана'}
        </p>
        <div style={mergedStyles.infoItem}>
          <img src={iconHospital} alt="Лікарня" style={baseStyles.infoIcon} />
          <p style={{ margin: '10px 0' }}><strong>Лікарня:</strong> {adminData.Hospital?.name}</p>
        </div>
        <div style={mergedStyles.infoItem}>
          <img src={iconLocation} alt="Адреса" style={baseStyles.infoIcon} />
          <p style={{ margin: '10px 0' }}><strong>Адреса:</strong> {adminData.Hospital?.address}</p>
        </div>
        <div style={mergedStyles.infoItem}>
          <img src={iconEmail} alt="Email" style={baseStyles.infoIcon} />
          <p style={{ margin: '10px 0' }}><strong>Email:</strong> {adminData.email || 'Немає даних'}</p>
        </div>
        <div style={mergedStyles.infoItem}>
          <img src={iconTelephone} alt="Телефон" style={baseStyles.infoIcon} />
          <p style={{ margin: '10px 0' }}><strong>Телефон:</strong> {adminData.phone || 'Немає даних'}</p>
        </div>
      </div>

      {isModalOpen && (
        <ModalEditAdmin
          admin={adminData}
          onClose={handleCloseModal}
          onSave={handleSave}  
        />
      )}

    </div>
  );
};

export default AdminCard;
