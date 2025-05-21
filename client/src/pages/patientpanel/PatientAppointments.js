import React, { useContext, useEffect, useState } from 'react';
import styles from '../../style/patientpanel/PatientAppointments.module.css';
import ModalAppointmentDetails from "../../components/modals/ModalAppointmentDetails";
import ModalCancelAppointment from "../../components/modals/ModalCancelAppointment";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import { formatAppointmentDate } from '../../utils/formatDate';

import { iconSearch } from '../../utils/icons';
import { Context } from '../../index';
import { fetchPatientByUserId } from '../../http/patientAPI';
import { fetchAllPatientsAppointments } from '../../http/appointmentAPI';

const PatientAppointments = () => {
  const { user } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getPatientAndAppointments = async () => {
      if (!user.user.id) return;

      try {
        const patient = await fetchPatientByUserId(user.user.id);
        const data = await fetchAllPatientsAppointments(patient.id);

        const formattedAppointments = data.map((a) => {
          const formattedDateTime = formatAppointmentDate(a);

          let statusLabel = "";
          let type = "";

          switch (a.status) {
            case "Scheduled":
              statusLabel = "● Майбутній";
              type = "upcoming";
              break;
            case "Completed":
              statusLabel = "● Минулий";
              type = "past";
              break;
            case "Cancelled":
              statusLabel = "● Скасований";
              type = "canceled";
              break;
            default:
              statusLabel = "● Невідомо";
              type = "unknown";
          }

          return {
            ...a,
            formattedDate: formattedDateTime,
            formattedTime: "", 
            statusLabel,
            type
          };
        });

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
      }
    };

    getPatientAndAppointments();
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

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.type === statusFilter;
    const doctorFullName = `${a.Doctor?.last_name} ${a.Doctor?.first_name} ${a.Doctor?.middle_name}`.toLowerCase();
    const specialization = a.Doctor?.specialization?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch = doctorFullName.includes(query) || specialization.includes(query);

    return matchesStatus && matchesSearch;
  })
  .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  return (
    <div className={styles.patientAppointments}>
      <h1 className={styles.title}>Мої прийоми</h1>
      <p className={styles.subtitle}>Тут ви можете переглянути всі свої записи на прийом до лікаря.</p>

      <div className={styles.filterGroup}>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Усі прийоми</option>
          <option value="upcoming">Майбутні</option>
          <option value="past">Минулі</option>
          <option value="canceled">Скасовані</option>
        </select>

        <div className={styles.searchWrapper}>
          <div className={styles.searchIcon}>
            <img src={iconSearch} alt="Search Icon" />
          </div>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Введіть ім'я лікаря або спеціалізацію"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
          <p className={styles.noResults}>Прийомів за вашим запитом не знайдено.</p>
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

export default PatientAppointments;
