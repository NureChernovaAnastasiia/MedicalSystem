import React, { useEffect, useState, useContext } from "react";
import styles from "../../style/patientpanel/PatientDashboard.module.css";
import { Context } from "../../index";
import { fetchPatientByUserId } from "../../http/patientAPI";
import { fetchUpcomingAppointments } from "../../http/appointmentAPI";
import { formatAppointmentDate } from "../../utils/formatDate";

import InfoCard from "../../components/elements/InfoCard";
import AppointmentCard from "../../components/appointment/AppointmentCardBrief";
import ModalAppointmentDetails from "../../components/modals/ModalAppointmentDetails";
import ModalAddReview from "../../components/modals/ModalAddReview";

import {
  iconInspection, iconAnalysis, iconPrescription, iconDiagnosis } from "../../utils/icons";

import {
  PATIENT_ANALYSEORDER_ROUTE, PATIENT_MEDRECORDS_ROUTE, PATIENT_PRESCRIPTIONS_ROUTE, PATIENT_SERVICEORDER_ROUTE } from "../../utils/consts";

const PatientDashboard = () => {
  const { user, hospital } = useContext(Context);
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const getPatientAndAppointments = async () => {
      if (!user.user.id) return;
      try {
        const patientData = await fetchPatientByUserId(user.user.id);
        setPatient(patientData);

        if (patientData.Hospital) {
        hospital.setHospital(patientData.Hospital);
        localStorage.setItem('hospital', JSON.stringify(patientData.Hospital));
      }

        const upcomingAppointments = await fetchUpcomingAppointments(patientData.id);

        const formattedAppointments = upcomingAppointments.map((appointment) => ({
          ...appointment,
          formattedDate: formatAppointmentDate(appointment),
        }));

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
      }
    };

    getPatientAndAppointments();
  }, [user.user.id, hospital]);

  const fullName = patient ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim() : "";
  const handleOpenAppointmentModal = (appointment) => setSelectedAppointment(appointment);
  const handleCloseAppointmentModal = () => setSelectedAppointment(null);

  return (
    <div className={styles.patientDashboard}>
      <h1 className={styles.welcomeMessage}>Вітаємо, {fullName}!</h1>

      <div className={styles.cardsContainer}>
        <InfoCard icon={iconInspection} title="Замовити послугу" to={PATIENT_SERVICEORDER_ROUTE} />
        <InfoCard icon={iconAnalysis} title="Замовити аналізи" to={PATIENT_ANALYSEORDER_ROUTE} />
        <InfoCard icon={iconPrescription} title="Мої рецепти" to={PATIENT_PRESCRIPTIONS_ROUTE} />
        <InfoCard icon={iconDiagnosis} title="Мої діагнози" to={PATIENT_MEDRECORDS_ROUTE} />
      </div>

      <div className={styles.appointmentsSection}>
        <h2 className={styles.appointmentsTitle}>Наступні прийоми</h2>
        <div className={styles.appointmentsList}>
          {appointments.length === 0 ? (
            <p className={styles.noAppointments}>Наразі прийомів не заплановано</p>
          ) : (
            appointments.map((appointment, index) => (
              <AppointmentCard
                key={index}
                appointment={appointment}
                onDetailsClick={handleOpenAppointmentModal}
              />
            ))
          )}
        </div>

        <div className={styles.feedbackSection}>
          <h2 className={styles.feedbackTitle}>Маєте враження від нашого сервісу?</h2>
          <p className={styles.feedbackText}>Залиште, будь ласка, ваш відгук – він допоможе нам стати кращими!</p>
          <button className={styles.feedbackButton} onClick={() => setShowReviewModal(true)}>Залишити відгук</button>
          {showReviewModal && <ModalAddReview onClose={() => setShowReviewModal(false)} />}
        </div>

        {selectedAppointment && (
          <ModalAppointmentDetails
            appointment={selectedAppointment}
            onClose={handleCloseAppointmentModal}
            onGoToCard={() => setSelectedAppointment(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
