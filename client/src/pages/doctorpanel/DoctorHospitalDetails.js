import React, { useContext, useEffect, useState } from 'react';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';

import { Context } from '../../index';
import { fetchDoctorByUserId } from '../../http/doctorAPI'; 
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
  const { user } = useContext(Context);
  const [hospital, setHospital] = useState(null);
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
    const fetchHospital = async () => {
      if (!user?.user?.id) return;
      try {
        const patientData = await fetchDoctorByUserId(user.user.id);

        if (patientData?.hospital_id) {
          const hospitalData = await fetchHospitalById(patientData.hospital_id);
          setHospital(hospitalData);

          const [labData, medicalData, doctorData] = await Promise.all([
            getHospitalLabServicesByHospitalId(patientData.hospital_id),
            getHospitalMedicalServicesByHospitalId(patientData.hospital_id),
            fetchDoctorsByHospitalId(patientData.hospital_id)
          ]);

          setAnalyses(labData);
          setServices(medicalData);
          setDoctors(doctorData);
        }
      } catch (error) {
        console.error('Помилка при завантаженні даних:', error);
      }
    };

    fetchHospital();
  }, [user]);

  return (
    <div className={styles.container}>
      {hospital && <HospitalHeader hospital={hospital} />}

      <h2 className={styles.servicesTitle}>Наші послуги</h2>
      <div className={styles.servicesContainer}>
        <ServiceList
          items={analyses}
          onInfoClick={handleOpenModal}
        />
        <ServiceList
          items={services}
          onInfoClick={handleOpenModal}
        />
      </div>

      <div className={styles.doctorTitle}>
        <h2 className={styles.sectionTitle}>Наші лікарі</h2>
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
      {isDoctorModalOpen && selectedDoctor && (
        <ModalDocInformation doctor={selectedDoctor} onClose={handleCloseDoctorModal} />
      )}
    </div>
  );
};

export default PatientHospitalDetails;
