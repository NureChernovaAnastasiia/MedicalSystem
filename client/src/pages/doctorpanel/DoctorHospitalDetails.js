import React, { useContext, useEffect, useState } from 'react';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';

import { Context } from '../../index';
import { fetchHospitalById } from '../../http/hospitalAPI';
import { getHospitalLabServicesByHospitalId } from '../../http/analysisAPI';
import { getHospitalMedicalServicesByHospitalId } from '../../http/servicesAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';

import ModalAnalysInfo from '../../components/modals/ModalAnalysInfo';
import ModalDocInformation from '../../components/modals/ModalDocInformation';

import HospitalHeader from '../../components/hospital/HospitalHeader';
import DoctorCard from '../../components/doctor/DoctorCardBrief';
import ServiceList from '../../components/service/ServiceList';

const PatientHospitalDetails = () => {
  const { hospital } = useContext(Context); 
  const [hospitalData, setHospitalData] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnalyse, setSelectedAnalyse] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);  

  const handleOpenModal = (analyse) => {
    setSelectedAnalyse(analyse);
    setIsModalOpen(true);
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
      if (!hospital?.hospital?.id) return;

      try {
        const hospitalInfo = await fetchHospitalById(hospital.hospital.id);
        setHospitalData(hospitalInfo);

        const [labData, medicalData, doctorData] = await Promise.all([
          getHospitalLabServicesByHospitalId(hospital.hospital.id),
          getHospitalMedicalServicesByHospitalId(hospital.hospital.id),
          fetchDoctorsByHospitalId(hospital.hospital.id)
        ]);

        setAnalyses(labData);
        setServices(medicalData);
        setDoctors(doctorData);
      } catch (error) {
        console.error('Помилка при завантаженні даних лікарні:', error);
      }
    };

    fetchHospitalData();
  }, [hospital]);

  return (
    <div className={styles.container}>
      {hospitalData && <HospitalHeader hospital={hospitalData} />}

      <h2 className={styles.servicesTitle}>Наші послуги</h2>
      <div className={styles.servicesContainer}>
        <ServiceList items={analyses} onInfoClick={handleOpenModal} />
        <ServiceList items={services} onInfoClick={handleOpenModal} />
      </div>

      <div className={styles.doctorTitle}>
        <h2 className={styles.sectionTitle}>Наші лікарі</h2>
      </div>

      <div className={styles.doctorGrid}>
        {doctors.map(doctor => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onDetailsClick={() => handleOpenDoctorModal(doctor)}
          />
        ))}
      </div>

      {isModalOpen && selectedAnalyse && (
        <ModalAnalysInfo onClose={() => setIsModalOpen(false)} analyse={selectedAnalyse} />
      )}
      {isDoctorModalOpen && selectedDoctor && (
        <ModalDocInformation doctor={selectedDoctor} onClose={handleCloseDoctorModal} />
      )}
    </div>
  );
};

export default PatientHospitalDetails;
