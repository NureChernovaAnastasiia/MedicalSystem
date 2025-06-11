import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';

import { Context } from '../../index';
import { fetchHospitalById } from '../../http/hospitalAPI';
import { getHospitalLabServicesByHospitalId } from '../../http/analysisAPI';
import { getHospitalMedicalServicesByHospitalId } from '../../http/servicesAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import ModalAnalysInfo from '../../components/modals/ModalAnalysInfo';
import ModalServicesOrdering from '../../components/modals/ModalServicesOrdering';
import ModalDocInformation from '../../components/modals/ModalDocInformation';

import HospitalHeader from '../../components/hospital/HospitalHeader';
import DoctorCard from '../../components/doctor/DoctorCardBrief';
import ServiceList from '../../components/service/ServiceList';

import { PATIENT_HOSPITALSCHEDULE_ROUTE } from '../../utils/consts';

const PatientHospitalDetails = () => {
  const { hospital } = useContext(Context);
  const [hospitalData, setHospitalData] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedAnalyse, setSelectedAnalyse] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);  

  const handleOpenModal = (analyse) => {
    setSelectedAnalyse(analyse);
    setIsModalOpen(true);
  };

  const handleOpenOrderModal = (analyse) => {
    setSelectedAnalyse(analyse);
    setIsOrderModalOpen(true);
  };

  const handleOpenDoctorModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const handleCloseDoctorModal = () => {
    setSelectedDoctor(null);
    setIsDoctorModalOpen(false);
  };

  useEffect(() => {
    const fetchHospitalData = async () => {
      if (!hospital?.hospitalId) return;

      try {
        const hospitalInfo = await fetchHospitalById(hospital.hospital.id);
        setHospitalData(hospitalInfo);

        const [labData, medicalData, doctorData] = await Promise.all([
          getHospitalLabServicesByHospitalId(hospital.hospitalId),
          getHospitalMedicalServicesByHospitalId(hospital.hospitalId),
          fetchDoctorsByHospitalId(hospital.hospitalId),
        ]);

        setAnalyses(labData);
        setServices(medicalData);
        setDoctors(doctorData);
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
      }
    };

    fetchHospitalData();
  }, [hospital]);

  return (
    <div className={styles.container}>
      {hospital && <HospitalHeader hospital={hospitalData} />}

      <h2 className={styles.servicesTitle}>Наші послуги</h2>
      <div className={styles.servicesContainer}>
        <ServiceList
          items={analyses}
          onInfoClick={handleOpenModal}
          onOrderClick={handleOpenOrderModal}
        />
        <ServiceList
          items={services}
          onInfoClick={handleOpenModal}
          onOrderClick={handleOpenOrderModal}
        />
      </div>

      <div className={styles.doctorTitle}>
        <h2 className={styles.sectionTitle}>Наші лікарі</h2>
        {hospital && (
          <NavLink to={`${PATIENT_HOSPITALSCHEDULE_ROUTE}/${hospital.hospitalId}`} className={styles.scheduleLink}>
            Розклад прийому лікарів
          </NavLink>
        )}
      </div>

      <div className={styles.doctorGrid}>
        <div className={styles.doctorGrid}>
          {doctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onDetailsClick={() => handleOpenDoctorModal(doctor)}
            />
          ))}
        </div>

      </div>
      {isModalOpen && selectedAnalyse && (
        <ModalAnalysInfo onClose={() => setIsModalOpen(false)} analyse={selectedAnalyse} />
      )}
      {isOrderModalOpen && selectedAnalyse && hospital && (
        <ModalServicesOrdering
          onClose={() => setIsOrderModalOpen(false)}
          analyse={selectedAnalyse}
          hospital={hospital.hospital}
        />
      )}
      {isDoctorModalOpen && selectedDoctor && (
        <ModalDocInformation doctor={selectedDoctor} onClose={handleCloseDoctorModal} />
      )}
    </div>
  );
};

export default PatientHospitalDetails;