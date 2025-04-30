import React, { useEffect, useState, useContext } from "react";
import { NavLink } from 'react-router-dom';
import styles from "../../style/PatientDashboard.module.css";
import { Context } from "../../index";
import { fetchPatientByUserId } from "../../http/patientAPI";

import iconBooking from '../../img/icons/inspection.png';
import iconAnalysis from '../../img/icons/labour.png';
import iconPrescription from '../../img/icons/medicine.png';
import iconDiagnosis from '../../img/icons/diagnosis.png';
import { PATIENT_ANALYSEORDER_ROUTE, PATIENT_MEDRECORDS_ROUTE, PATIENT_PRESCRIPTIONS_ROUTE, PATIENT_SERVICEORDER_ROUTE, } from "../../utils/consts";

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

const AppointmentCard = ({ date, doctor, location }) => (
  <div className={styles.appointmentCard}>
    <p className={styles.appointmentInfo}>
      <strong>Дата і час прийому:</strong> <span className={styles.lightText}>{date}</span> <br />
      <strong>Лікар:</strong> <span className={styles.lightText}>{doctor}</span> <br />
      <strong>Місцезнаходження:</strong> <span className={styles.lightText}>{location}</span>
    </p>
    <div className={styles.appointmentDetails}>
      <span className={styles.questionMark}>?</span>
      <span className={styles.detailsText}>Деталі прийому</span>
    </div>
  </div>
);

const PatientDashboard = () => {
  const { user } = useContext(Context);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const getPatient = async () => {
      if (!user.user.id) return;
      try {
        const data = await fetchPatientByUserId(user.user.id);
        setPatient(data);
      } catch (error) {
        console.error("Не вдалося завантажити дані пацієнта:", error);
        setPatient(null);
      }
    };
    getPatient();
  }, [user.user.id]);

  const appointments = [
    {
      date: "11 квітня 2025, 10:00",
      doctor: "Олександра Петрова",
      location: "Амбулаторія сімейної медицини 'Цінність'",
    },
    {
      date: "15 квітня 2025, 12:00",
      doctor: "Іван Іванов",
      location: "Клініка здоров'я",
    },
    {
      date: "20 квітня 2025, 09:00",
      doctor: "Марія Коваленко",
      location: "Медичний центр 'Довіра'",
    },
  ];
  const fullName = patient ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim() : "";

  return (
    <div className={styles.patientDashboard}>
      <h1 className={styles.welcomeMessage}>Вітаємо, {fullName}!</h1>

      <div className={styles.cardsContainer}>
        <InfoCard icon={iconBooking} title="Замовити послугу" to={PATIENT_SERVICEORDER_ROUTE} />
        <InfoCard icon={iconAnalysis} title="Замовити аналізи" to={PATIENT_ANALYSEORDER_ROUTE} />
        <InfoCard icon={iconPrescription} title="Мої рецепти" to={PATIENT_PRESCRIPTIONS_ROUTE} />
        <InfoCard icon={iconDiagnosis} title="Мої діагнози" to={PATIENT_MEDRECORDS_ROUTE} />
      </div>


      <div className={styles.appointmentsSection}>
        <h2 className={styles.appointmentsTitle}>Наступні прийоми</h2>
        <div className={styles.appointmentsList}>
          {appointments.map((appointment, index) => (
            <AppointmentCard
              key={index}
              date={appointment.date}
              doctor={appointment.doctor}
              location={appointment.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
