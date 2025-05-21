import React, { useContext, useEffect, useState } from 'react';
import styles from '../../style/PatientAppointments.module.css';
import ModalAppointmentDetails from "../../components/modals/ModalAppointmentDetails";
import ModalCancelAppointment from "../../components/modals/ModalCancelAppointment";

import iconSearch from '../../img/icons/search.png';
import { Context } from '../../index';
import { fetchPatientByUserId } from '../../http/patientAPI';
import { fetchAllPatientsAppointments } from '../../http/appointmentAPI';

const AppointmentCard = ({ appointment, onDetailsClick, onCancelClick  }) => {
  const doctor = `${appointment.Doctor?.last_name} ${appointment.Doctor?.first_name} ${appointment.Doctor?.middle_name}`;
  const specialization = appointment.Doctor?.specialization || 'Невідома спеціалізація';
  const location = `${appointment.Doctor?.Hospital?.name || "Невідома лікарня"},  ${appointment.Doctor?.Hospital?.address}`;

  const statusStyle = styles[appointment.type] || '';
  const canCancel = appointment.type === 'upcoming';

  return (
    <div className={`${styles.appointmentCard} ${statusStyle}`}>
      <div className={styles.cardStatus}>{appointment.statusLabel}</div>

      <div className={styles.cardInfo}>
        <p><span className={styles.boldText}>Ім'я лікаря:</span><span> {doctor}</span></p>
        <p><span className={styles.boldText}>Спеціалізація:</span><span> {specialization}</span></p>
        <p><span className={styles.boldText}>Дата прийому:</span><span> {appointment.formattedDate}</span></p>
        <p><span className={styles.boldText}>Час:</span><span> {appointment.formattedTime}</span></p>
        <p><span className={styles.boldText}>Місце прийому:</span><span> {location}</span></p>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.cardDetails} onClick={() => onDetailsClick(appointment)}>
          <span className={styles.questionMark}>?</span>
          <span className={styles.detailsText}>Переглянути деталі</span>
        </div>

        {canCancel && (
          <div className={styles.cardActions} onClick={() => onCancelClick(appointment)}>
            <span className={styles.cancelCross}>×</span>
            <span className={styles.cancelText}>Скасувати</span>
          </div>
        )}
      </div>
    </div>
  );
};

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
          let appointmentDate;
          let startTime;
          let endTime;

          if (a.DoctorSchedule) {
            const schedule = a.DoctorSchedule;
            appointmentDate = a.appointment_date || schedule.appointment_date;
            startTime = schedule.start_time;
            endTime = schedule.end_time;

            const dateObj = new Date(`${appointmentDate}T${startTime}`);

            appointmentDate = dateObj.toLocaleDateString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            const formatTime = (timeStr) => {
              const [hours, minutes] = timeStr.split(":");
              return `${hours}:${minutes}`;
            };

            startTime = formatTime(startTime);
            endTime = formatTime(endTime);
          } else if (a.LabTestSchedule || a.MedicalServiceSchedule) {
            const schedule = a.LabTestSchedule || a.MedicalServiceSchedule;

            const startDate = new Date(schedule.start_time);
            const endDate = new Date(schedule.end_time);

            appointmentDate = startDate.toLocaleDateString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

            const formatTime = (dateObj) =>
              `${dateObj.getHours().toString().padStart(2, "0")}:${dateObj
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;

            startTime = formatTime(startDate);
            endTime = formatTime(endDate);
          } else {
            appointmentDate = "Невідома дата";
            startTime = "??:??";
            endTime = "??:??";
          }

          const formattedDate = appointmentDate;
          const formattedTime = `${startTime} - ${endTime}`;

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

          return { ...a, formattedDate, formattedTime, statusLabel, type };
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
