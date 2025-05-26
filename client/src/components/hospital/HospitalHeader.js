import React, { useState, useEffect } from 'react';
import {
  iconHospital,
  iconAddress,
  iconTelephone,
  iconEmail
} from '../../utils/icons';

const baseStyles = {
  headerContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  headerBox: {
    background: '#f6f6f6',
    borderRadius: '20px',
    padding: '26px 42px',
    maxWidth: '1200px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  hospitalNameBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  hospitalIcon: {
    width: '65px',
    height: '65px',
  },
  hospitalName: {
    fontWeight: 500,
    fontSize: '30px',
    color: '#000',
  },
  middleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '0 80px',
  },
  clinicType: {
    background: '#00c3a1',
    borderRadius: '10px',
    padding: '4px 18px',
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '16px',
    color: '#fff',
  },
  schedule: {
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: '20px',
    color: '#333',
    textAlign: 'left',
  },
  headerInfo: {
    display: 'flex',
    flexBasis: 'calc(50% - 25px)',
    padding: '0 40px',
    gap: '40%',
  },
  leftSide: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  rightSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconSmall: {
    width: '35px',
    height: '35px',
  },
  contactText: {
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: '19px',
    color: '#333',
  },
  addressBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  address: {
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: '19px',
    color: '#333',
  },
};

const ContactInfo = ({ icon, text, isSmallScreen }) => (
  <div style={{
    ...baseStyles.contactItem,
    ...(isSmallScreen && { justifyContent: 'flex-start' })
  }}>
    <img src={icon} alt="Icon" style={baseStyles.iconSmall} />
    <span style={baseStyles.contactText}>{text}</span>
  </div>
);

const HospitalHeader = ({ hospital }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 767);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!hospital) return null;

  const responsiveStyles = {
    headerBox: {
      ...baseStyles.headerBox,
      padding: isSmallScreen ? '16px 20px' : baseStyles.headerBox.padding,
    },
    hospitalName: {
      ...baseStyles.hospitalName,
      fontSize: isSmallScreen ? '22px' : baseStyles.hospitalName.fontSize,
    },
    hospitalIcon: {
      ...baseStyles.hospitalIcon,
      width: isSmallScreen ? '45px' : baseStyles.hospitalIcon.width,
      height: isSmallScreen ? '45px' : baseStyles.hospitalIcon.height,
    },
    middleRow: {
      ...baseStyles.middleRow,
      flexDirection: isSmallScreen ? 'column' : 'row',
      alignItems: isSmallScreen ? 'flex-start' : 'center',
      padding: isSmallScreen ? '0 20px' : baseStyles.middleRow.padding,
      gap: isSmallScreen ? '10px' : '0',
    },
    headerInfo: {
      ...baseStyles.headerInfo,
      flexDirection: isSmallScreen ? 'column' : 'row',
      gap: isSmallScreen ? '20px' : baseStyles.headerInfo.gap,
      padding: isSmallScreen ? '0 20px' : baseStyles.headerInfo.padding,
    },
    contactText: {
      ...baseStyles.contactText,
      fontSize: isSmallScreen ? '16px' : baseStyles.contactText.fontSize,
    },
    address: {
      ...baseStyles.address,
      fontSize: isSmallScreen ? '16px' : baseStyles.address.fontSize,
    },
  };

  return (
    <div style={baseStyles.headerContainer}>
      <div style={responsiveStyles.headerBox}>
        <div style={baseStyles.hospitalNameBlock}>
          <img src={iconHospital} alt="Hospital Icon" style={responsiveStyles.hospitalIcon} />
          <span style={responsiveStyles.hospitalName}>{hospital.name}</span>
        </div>

        <div style={responsiveStyles.middleRow}>
          <div style={baseStyles.clinicType}>{hospital.type} лікарня</div>
          <div style={baseStyles.schedule}>{hospital.working_hours}</div>
        </div>

        <div style={responsiveStyles.headerInfo}>
          <div style={baseStyles.leftSide}>
            <div style={baseStyles.addressBox}>
              <img src={iconAddress} alt="Address Icon" style={baseStyles.iconSmall} />
              <span style={responsiveStyles.address}>{hospital.address}</span>
            </div>
          </div>

          <div style={baseStyles.rightSide}>
            <ContactInfo icon={iconTelephone} text={hospital.phone} isSmallScreen={isSmallScreen} />
            <ContactInfo icon={iconEmail} text={hospital.email} isSmallScreen={isSmallScreen} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalHeader;
