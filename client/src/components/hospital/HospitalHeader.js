import React from 'react';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';

import {
  iconHospital,
  iconAddress,
  iconTelephone,
  iconEmail
} from '../../utils/icons';

const ContactInfo = ({ icon, text }) => (
  <div className={styles.contactItem}>
    <img src={icon} alt="Icon" className={styles.iconSmall} />
    <span className={styles.contactText}>{text}</span>
  </div>
);

const HospitalHeader = ({ hospital }) => {
  if (!hospital) return null;

  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerBox}>
        <div className={styles.hospitalNameBlock}>
          <img src={iconHospital} alt="Hospital Icon" className={styles.hospitalIcon} />
          <span className={styles.hospitalName}>{hospital.name}</span>
        </div>

        <div className={styles.middleRow}>
          <div className={styles.clinicType}>{hospital.type} лікарня</div>
          <div className={styles.schedule}>{hospital.working_hours}</div>
        </div>

        <div className={styles.headerInfo}>
          <div className={styles.leftSide}>
            <div className={styles.addressBox}>
              <img src={iconAddress} alt="Address Icon" className={styles.iconSmall} />
              <span className={styles.address}>{hospital.address}</span>
            </div>
          </div>

          <div className={styles.rightSide}>
            <ContactInfo icon={iconTelephone} text={hospital.phone} />
            <ContactInfo icon={iconEmail} text={hospital.email} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalHeader;
