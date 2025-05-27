import React, { useEffect, useState, useContext } from "react";
import styles from "../../style/doctorpanel/DoctorDashboard.module.css";
import { Context } from "../../index";
import { fetchDoctorByUserId, fetchDoctorById } from "../../http/doctorAPI";
import { fetchDoctorWorkingHoursByIdAndDate } from '../../http/doctorScheduleAPI';

import InfoCard from "../../components/elements/InfoCard";
import DoctorCard from "../../components/doctor/DoctorCardWork";
import ModalDocInformation from '../../components/modals/ModalDocInformation';
import DoctorScheduleTable from "../../components/doctor/DoctorScheduleTable";
import ModalRegisterPatient from "../../components/modals/ModalRegisterPatient";
import ModalCreateAppointment from "../../components/modals/ModalCreateAppointment";

import { iconMedCard, iconSchedule, iconDuration, } from "../../utils/icons";

import { DOCTOR_ALLAPPOINTMENTS_ROUTE, } from "../../utils/consts";

const DoctorDashboard = () => {
  const { user, hospital } = useContext(Context);
  const [doctor, setDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [weekDates, setWeekDates] = useState([]);
  const [workingHours, setWorkingHours] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    const getWeekDates = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);

      const dates = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(date.toISOString().slice(0, 10));
      }
      return dates;
    };

    const fetchData = async () => {
      if (!user.user.id) return;

      try {
        const { id: doctorId } = await fetchDoctorByUserId(user.user.id);
        const doctorData = await fetchDoctorById(doctorId);
        setDoctor(doctorData);
        setDoctors([doctorData]);

        if (doctorData.Hospital) {
          hospital.setHospital(doctorData.Hospital); 
          localStorage.setItem('hospital', JSON.stringify(doctorData.Hospital)); 
        }

        const weekDatesData = getWeekDates();
        setWeekDates(weekDatesData);

        const hours = {};
        hours[doctorData.id] = {};

        await Promise.all(
          weekDatesData.map(async (date) => {
            try {
              const working = await fetchDoctorWorkingHoursByIdAndDate(doctorData.id, date);
              hours[doctorData.id][date] = working;
            } catch {
              hours[doctorData.id][date] = null;
            }
          })
        );

        setWorkingHours(hours);
      } catch (error) {
        console.error("Помилка при завантаженні даних лікаря або розкладу:", error);
      }
    };

    fetchData();
  }, [user.user.id, hospital]);

  const fullName = doctor
    ? `${doctor.last_name || ""} ${doctor.first_name || ""}`.trim()
    : "";

  const handleOpenModal = (doctorData) => {
    setSelectedDoctor(doctorData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className={styles.patientDashboard}>
      <h1 className={styles.welcomeMessage}>Вітаємо, {fullName}!</h1>

      <div className={styles.cardsContainer}>
        <InfoCard icon={iconMedCard} title="Зареєструвати пацієнта" onClick={() => setIsRegisterModalOpen(true)} />
        <InfoCard icon={iconSchedule} title="Всі прийоми" to={DOCTOR_ALLAPPOINTMENTS_ROUTE} />
        <InfoCard icon={iconDuration} title="Назначити прийом" onClick={() => setIsAppointmentModalOpen(true)} />
      </div>

      {isRegisterModalOpen && doctor && (
        <ModalRegisterPatient
          doctor={doctor}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}

      {isAppointmentModalOpen && doctor && (
        <ModalCreateAppointment
          doctorId={doctor.id}
          onClose={() => setIsAppointmentModalOpen(false)}
        />
      )}

      {doctor && <DoctorCard doctor={doctor} onOpenModal={handleOpenModal} />}

      {isModalOpen && selectedDoctor && (
        <ModalDocInformation doctor={selectedDoctor} onClose={handleCloseModal} />
      )}

      <div className={styles.scheduleContainer}>
        <p className={styles.subtitle}>
          Нижче представлений графік роботи на поточний тиждень.
        </p>

        <DoctorScheduleTable
          doctors={doctors}
          weekDates={weekDates}
          workingHours={workingHours}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;
