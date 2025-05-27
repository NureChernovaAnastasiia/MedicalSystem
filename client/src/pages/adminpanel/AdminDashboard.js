import React, { useEffect, useState, useContext } from "react";
import styles from "../../style/doctorpanel/DoctorDashboard.module.css";
import { Context } from "../../index";
import { fetchDoctorByUserId, fetchDoctorById } from "../../http/doctorAPI";

import InfoCard from "../../components/elements/InfoCard";
import DoctorCard from "../../components/doctor/DoctorCardWork";
import ModalDocInformation from '../../components/modals/ModalDocInformation';
import ModalRegisterPatient from "../../components/modals/ModalRegisterPatient";
import ModalCreateAppointment from "../../components/modals/ModalCreateAppointment";

import { iconMedCard, iconSchedule, iconDuration, } from "../../utils/icons";

import { DOCTOR_ALLAPPOINTMENTS_ROUTE, } from "../../utils/consts";

const AdminDashboard = () => {
  const { user } = useContext(Context);
  const [doctor, setDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user.user.id) return;

      try {
        const { id: doctorId } = await fetchDoctorByUserId(user.user.id);
        const doctorData = await fetchDoctorById(doctorId);
        setDoctor(doctorData);

      } catch (error) {
        console.error("Помилка при завантаженні даних лікаря або розкладу:", error);
      }
    };

    fetchData();
  }, [user.user.id]);

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

    </div>
  );
};

export default AdminDashboard;
