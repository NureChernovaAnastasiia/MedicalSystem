import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorAppointments.module.css';
import ModalCancelAppointment from "../../components/modals/ModalCancelAppointment";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import SearchInput from "../../components/options/SearchInput";
import { Context } from '../../index';
import { fetchAppointmentsByHospitalAndDate } from '../../http/appointmentAPI'; 
import { formatAppointmentDate } from '../../utils/formatDate';
import { ADMIN_ALLAPPOINTMENTS_ROUTE, } from '../../utils/consts';

const AdminAppointments = () => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [appointments, setAppointments] = useState([]);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!hospitalId) return;

    const getAppointments = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const data = await fetchAppointmentsByHospitalAndDate(hospitalId, today);
        const formatted = data.map(formatAndLabelAppointment);
        setAppointments(formatted);
      } catch (error) {
        console.error("Error loading appointments:", error);
      }
    };

    getAppointments();
  }, [hospitalId]);

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

  const matchesSearchQuery = (appointment) => {
    const patientFullName = `${appointment.Patient?.last_name} ${appointment.Patient?.first_name}`.toLowerCase();
    const doctorFullName = `${appointment.Doctor?.last_name} ${appointment.Doctor?.first_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();

    return patientFullName.includes(query) || doctorFullName.includes(query);
  };


  const filteredAppointments = appointments
    .filter(a => a.type === 'upcoming' && matchesSearchQuery(a))
    .sort((a, b) => {
    const dateTimeA = new Date(`${a.appointment_date}T${a.DoctorSchedule?.start_time || '00:00'}`);
    const dateTimeB = new Date(`${b.appointment_date}T${b.DoctorSchedule?.start_time || '00:00'}`);
    return dateTimeA - dateTimeB;
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Прийоми на сьогодні</h1>
        <div className={styles.orderButtonWrapper}>
          <NavLink to={ADMIN_ALLAPPOINTMENTS_ROUTE}>
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
              onCancelClick={handleCancelClick}
            />
          ))
        ) : (
          <p className={styles.noResults}>Прийомів на сьогодні більше немає.</p>
        )}
      </div>

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

export default AdminAppointments;
