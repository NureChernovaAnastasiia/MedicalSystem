import React, { useEffect, useState, useContext } from "react";
import { NavLink } from 'react-router-dom';
import styles from "../../style/PatientDashboard.module.css";
import { Context } from "../../index";
import { fetchPatientByUserId } from "../../http/patientAPI";
import { fetchUpcomingAppointments } from "../../http/appointmentAPI";
import ModalAppointmentDetails from "../../components/modals/ModalAppointmentDetails";

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

const AppointmentCard = ({ appointment, onDetailsClick }) => {
  const doctor = `${appointment.Doctor?.last_name} ${appointment.Doctor?.first_name} ${appointment.Doctor?.middle_name}`;
  const location = appointment.Doctor?.Hospital?.name || "Невідома лікарня";

  return (
    <div className={styles.appointmentCard}>
      <p className={styles.appointmentInfo}>
        <strong>Дата і час прийому:</strong> <span className={styles.lightText}>{appointment.formattedDate}</span> <br />
        <strong>Лікар:</strong> <span className={styles.lightText}>{doctor}</span> <br />
        <strong>Місцезнаходження:</strong> <span className={styles.lightText}>{location}</span>
      </p>
      <div className={styles.appointmentDetails} onClick={() => onDetailsClick(appointment)}>
        <span className={styles.questionMark}>?</span>
        <span className={styles.detailsText}>Деталі прийому</span>
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const { user } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const getPatientAndAppointments = async () => {
      if (!user.user.id) return;
      try {
        const patientData = await fetchPatientByUserId(user.user.id);
        setPatient(patientData);

        const upcomingAppointments = await fetchUpcomingAppointments(patientData.id);
        const formattedAppointments = upcomingAppointments.map((a) => {
          const schedule = a.DoctorSchedule || a.LabTestSchedule || a.MedicalServiceSchedule;

          const appointmentDate = a.appointment_date || (schedule && schedule.appointment_date) || '';
          const startTime = schedule?.start_time || '00:00:00';

          const dateObj = appointmentDate && startTime ? new Date(`${appointmentDate}T${startTime}`) : null;

          const formattedDate = dateObj
            ? dateObj.toLocaleString("uk-UA", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })
            : "Дата і час не вказані";

          return { ...a, formattedDate };
        });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
      }
    };

    getPatientAndAppointments();
  }, [user.user.id]);

  const fullName = patient ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim() : "";
  const handleOpenAppointmentModal = (appointment) => setSelectedAppointment(appointment);
  const handleCloseAppointmentModal = () => setSelectedAppointment(null);


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
              appointment={appointment}
              onDetailsClick={handleOpenAppointmentModal}
            />
          ))}
        </div>
        {selectedAppointment && (
          <ModalAppointmentDetails
            appointment={selectedAppointment}
            onClose={handleCloseAppointmentModal}
            onGoToCard={() => {
              setSelectedAppointment(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
