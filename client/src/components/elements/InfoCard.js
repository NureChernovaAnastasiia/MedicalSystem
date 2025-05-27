import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../style/patientpanel/PatientDashboard.module.css";

const InfoCard = ({ icon, title, to, onClick }) => {
  const content = (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardImage}>
        <img src={icon} alt={title} className={styles.cardIcon} />
      </div>
      <div className={styles.cardTitle}>{title}</div>
    </div>
  );

  return to ? (
    <NavLink to={to} className={styles.cardLink}>
      {content}
    </NavLink>
  ) : (
    <div className={styles.cardLink} style={{ cursor: "pointer" }}>
      {content}
    </div>
  );
};

export default InfoCard;
