import React, { useEffect, useState, useContext } from "react";
import styles from "../../style/doctorpanel/DoctorDashboard.module.css";
import { Context } from "../../index";
import { fetchHospitalStaffByUserId } from "../../http/hospitalStaffAPI"; 

import InfoCard from "../../components/elements/InfoCard";
import AdminCard from "../../components/hospitalstaff/AdminCard"; 
import ModalDocInformation from '../../components/modals/ModalDocInformation';
import ModalRegisterPatient from "../../components/modals/ModalRegisterPatient";
import ModalCreateAppointment from "../../components/modals/ModalCreateAppointment";
import ModalRegistrationDocStaff from "../../components/modals/ModalRegistrationDocStaff";

import { iconPeople, iconDoctor ,iconSchedule, iconDuration } from "../../utils/icons";

import { ADMIN_ALLAPPOINTMENTS_ROUTE,} from "../../utils/consts";

const AdminDashboard = () => {
  const { user, hospital } = useContext(Context);
  const [staff, setStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isRegisterStaffModalOpen, setIsRegisterStaffModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user.user.id) return;

      try {
        const staffData = await fetchHospitalStaffByUserId(user.user.id);
        setStaff(staffData);

        if (staffData.Hospital) {
          hospital.setHospital(staffData.Hospital);
          localStorage.setItem('hospital', JSON.stringify(staffData.Hospital));
        }
      } catch (error) {
        console.error("Помилка при завантаженні даних hospital staff:", error);
      }
    };

    fetchData();
  }, [user.user.id, hospital]);

  const fullName = staff
    ? `${staff.last_name || ""} ${staff.first_name || ""}`.trim()
    : "";

  const handleOpenModal = (staffData) => {
    setSelectedStaff(staffData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className={styles.patientDashboard}>
      <h1 className={styles.welcomeMessage}>Вітаємо, {fullName}!</h1>

      <div className={styles.cardsContainer}>
        <InfoCard icon={iconPeople} title="Зареєструвати пацієнта" onClick={() => setIsRegisterModalOpen(true)} />
        <InfoCard icon={iconDoctor} title="Зареєструвати працівника" onClick={() => setIsRegisterStaffModalOpen(true)} />
        <InfoCard icon={iconSchedule} title="Всі прийоми" to={ADMIN_ALLAPPOINTMENTS_ROUTE} />
        <InfoCard icon={iconDuration} title="Назначити прийом" onClick={() => setIsAppointmentModalOpen(true)} />
      </div>

      {isRegisterModalOpen && staff && (
        <ModalRegisterPatient
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}

      {isAppointmentModalOpen && staff && (
        <ModalCreateAppointment
          doctorId={staff.id}
          onClose={() => setIsAppointmentModalOpen(false)}
        />
      )}

      {isRegisterStaffModalOpen && (
        <ModalRegistrationDocStaff
          onClose={() => setIsRegisterStaffModalOpen(false)}
        />
      )}

      {staff && <AdminCard admin={staff} onOpenModal={handleOpenModal} />}

      {isModalOpen && selectedStaff && (
        <ModalDocInformation doctor={selectedStaff} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default AdminDashboard;
