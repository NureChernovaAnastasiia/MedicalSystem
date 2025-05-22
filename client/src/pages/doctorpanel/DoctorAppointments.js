import React, { useContext, useEffect, useState } from 'react';
import styles from '../../style/doctorpanel/DoctorAppointments.module.css';
import ModalAppointmentDetails from "../../components/modals/ModalAppointmentDetails";
import ModalCancelAppointment from "../../components/modals/ModalCancelAppointment";
import DoctorAppointmentCard from "../../components/appointment/DoctorAppointmentCard";
import { formatAppointmentDate } from '../../utils/formatDate';

import { iconSearch } from '../../utils/icons';
import { Context } from '../../index';
import { fetchDoctorByUserId } from '../../http/doctorAPI';
import { fetchAllDoctorAppointments } from '../../http/appointmentAPI';

const DoctorAppointments = () => {
  const { user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getDoctorAndAppointments = async () => {
      if (!user.user.id) return;

      try {
        const doctor = await fetchDoctorByUserId(user.user.id);
        const data = await fetchAllDoctorAppointments(doctor.id);

        const formattedAppointments = data.map((a) => {
          const formattedDateTime = formatAppointmentDate(a);

          let statusLabel = "";
          let type = "";

          switch (a.status) {
            case "Scheduled":
              statusLabel = "● Майбутній";
              type = "upcoming";
              break;
            default:
              statusLabel = "● Невідомо";
              type = "unknown";
          }

          return {
            ...a,
            formattedDate: formattedDateTime,
            statusLabel,
            type
          };
        });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Помилка при завантаженні даних лікаря:", error);
      }
    };

    getDoctorAndAppointments();
  }, [user.user.id]);

  const handleOpenAppointmentModal = (appointment) => setSelectedAppointment(appointment);
  const handleCloseAppointmentModal = () => setSelectedAppointment(null);

  const handleCancelClick = (appointment) => setAppointmentToCancel(appointment);
  const handleCloseCancelModal = () => setAppointmentToCancel(null);
  const handleConfirmCancel = () => {
    console.log("Скасування:", appointmentToCancel.id);
    setAppointmentToCancel(null);
  };

  const handleAppointmentCancelled = (cancelledId) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === cancelledId
          ? {
              ...app,
              status: 'Cancelled',
              statusLabel: '● Скасований',
              type: 'canceled',
            }
          : app
      )
    );
  };

  const filteredAppointments = appointments
  .filter((a) => {
    if (a.type !== 'upcoming') return false;

    const today = new Date();
    const appointmentDate = new Date(a.appointment_date);

    const isSameDay =
      today.getFullYear() === appointmentDate.getFullYear() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getDate() === appointmentDate.getDate();

    if (!isSameDay) return false;

    const patientName = `${a.Patient?.last_name} ${a.Patient?.first_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();

    return patientName.includes(query);
  })
  .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Прийоми на сьогодні</h1>
          <div className={styles.orderButtonWrapper}>
            <button className={styles.orderButton}>Всі прийоми</button>
          </div>
      </div>

      <div className={styles.filterGroup}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <img src={iconSearch} alt="Search Icon" />
          </div>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Введіть ім'я пацієнта"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.appointmentsCards}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <DoctorAppointmentCard
              key={index}
              appointment={appointment}
              onDetailsClick={handleOpenAppointmentModal}
              onCancelClick={handleCancelClick}
            />
          ))
        ) : (
          <p className={styles.noResults}>Майбутніх прийомів за запитом не знайдено.</p>
        )}
      </div>

      {selectedAppointment && (
        <ModalAppointmentDetails
          appointment={selectedAppointment}
          onClose={handleCloseAppointmentModal}
        />
      )}

      {appointmentToCancel && (
        <ModalCancelAppointment
          appointment={appointmentToCancel}
          onClose={handleCloseCancelModal}
          onCancel={handleConfirmCancel}
          onAppointmentCancelled={handleAppointmentCancelled}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
