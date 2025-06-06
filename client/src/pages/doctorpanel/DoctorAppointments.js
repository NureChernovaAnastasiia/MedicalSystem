import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorAppointments.module.css';
import ModalAppointmentDetails from "../../components/modals/ModalAppointmentDetails";
import ModalCancelAppointment from "../../components/modals/ModalCancelAppointment";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import SearchInput from "../../components/options/SearchInput";
import { Context } from '../../index';
import { fetchDoctorByUserId } from '../../http/doctorAPI';
import { fetchAllDoctorAppointments } from '../../http/appointmentAPI';
import { formatAppointmentDate } from '../../utils/formatDate';
import { DOCTOR_ALLAPPOINTMENTS_ROUTE } from '../../utils/consts';

const DoctorAppointments = () => {
  const { user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user.user.id) return;

    const getDoctorAndAppointments = async () => {
      try {
        const doctor = await fetchDoctorByUserId(user.user.id);
        const data = await fetchAllDoctorAppointments(doctor.id);
        const formatted = data.map(formatAndLabelAppointment);
        setAppointments(formatted);
      } catch (error) {
        console.error("Помилка при завантаженні даних лікаря:", error);
      }
    };

    getDoctorAndAppointments();
  }, [user.user.id]);

  const formatAndLabelAppointment = (appointment) => {
    const formattedDateTime = formatAppointmentDate(appointment);
    let statusLabel = "● Невідомо";
    let type = "unknown";

    if (appointment.status === "Scheduled") {
      statusLabel = "● Майбутній";
      type = "upcoming";
    }

    return {
      ...appointment,
      formattedDate: formattedDateTime,
      statusLabel,
      type
    };
  };

  const handleOpenAppointmentModal = setSelectedAppointment;
  const handleCloseAppointmentModal = () => setSelectedAppointment(null);

  const handleCancelClick = setAppointmentToCancel;
  const handleCloseCancelModal = () => setAppointmentToCancel(null);

  const handleConfirmCancel = () => {
    if (appointmentToCancel) {
      console.log("Скасування:", appointmentToCancel.id);
      setAppointmentToCancel(null);
    }
  };

  const handleAppointmentCancelled = (cancelledId) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === cancelledId
          ? { ...app, status: 'Cancelled', statusLabel: '● Скасований', type: 'canceled' }
          : app
      )
    );
  };

  const isToday = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    return today.toDateString() === date.toDateString();
  };

  const matchesSearchQuery = (appointment) => {
    const fullName = `${appointment.Patient?.last_name} ${appointment.Patient?.first_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  };

  const filteredAppointments = appointments
    .filter(a => a.type === 'upcoming' && isToday(a.appointment_date) && matchesSearchQuery(a))
    .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Прийоми на сьогодні</h1>
        <div className={styles.orderButtonWrapper}>
          <NavLink to={DOCTOR_ALLAPPOINTMENTS_ROUTE}>
            <button className={styles.orderButton}>Всі прийоми</button>
          </NavLink>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Введіть ім'я пацієнта"
        />
      </div>

      <div className={styles.appointmentsCards}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <AppointmentCard
              key={index}
              appointment={appointment}
              onDetailsClick={handleOpenAppointmentModal}
              onCancelClick={handleCancelClick}
            />
          ))
        ) : (
          <p className={styles.noResults}>Прийомів на сьогодні більше немає.</p>
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
