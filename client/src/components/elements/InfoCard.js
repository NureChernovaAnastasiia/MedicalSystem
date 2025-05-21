import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../style/PatientDashboard.module.css";

const InfoCard = ({ icon, title, to }) => (
  <NavLink to={to} className={styles.cardLink}>
    <div className={styles.card}>
      <div className={styles.cardImage}>
        <img src={icon} alt={title} className={styles.cardIcon} />
      </div>
      <div className={styles.cardTitle}>{title}</div>
    </div>
  </NavLink>
);

export default InfoCard;
