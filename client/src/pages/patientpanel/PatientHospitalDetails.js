import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';

import { Context } from '../../index';
import { fetchPatientByUserId } from '../../http/patientAPI';
import { fetchHospitalById } from '../../http/hospitalAPI';
import { getHospitalLabServicesByHospitalId } from '../../http/analysisAPI';
import { getHospitalMedicalServicesByHospitalId } from '../../http/servicesAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import ModalAnalysInfo from '../../components/modals/ModalAnalysInfo';
import ModalServicesOrdering from '../../components/modals/ModalServicesOrdering';

import HospitalHeader from '../../components/hospital/HospitalHeader';
import DoctorCard from '../../components/doctor/DoctorCardBrief';
import ServiceList from '../../components/service/ServiceList';

import { PATIENT_HOSPITALSCHEDULE_ROUTE } from '../../utils/consts';

const PatientHospitalDetails = () => {
  const { user } = useContext(Context);
  const [hospital, setHospital] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedAnalyse, setSelectedAnalyse] = useState(null);

  const handleOpenModal = (analyse) => {
    setSelectedAnalyse(analyse);
    setIsModalOpen(true);
  };

  const handleOpenOrderModal = (analyse) => {
    setSelectedAnalyse(analyse);
    setIsOrderModalOpen(true);
  };

  useEffect(() => {
    const fetchHospital = async () => {
      if (!user?.user?.id) return;
      try {
        const patientData = await fetchPatientByUserId(user.user.id);

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
          <NavLink to={`${PATIENT_HOSPITALSCHEDULE_ROUTE}/${hospital.id}`} className={styles.scheduleLink}>
            Розклад прийому лікарів
          </NavLink>
        )}
      </div>

      <div className={styles.doctorGrid}>
        {doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)}
      </div>
      {isModalOpen && selectedAnalyse && (
        <ModalAnalysInfo onClose={() => setIsModalOpen(false)} analyse={selectedAnalyse} />
      )}
      {isOrderModalOpen && selectedAnalyse && hospital && (
        <ModalServicesOrdering
          onClose={() => setIsOrderModalOpen(false)}
          analyse={selectedAnalyse}
          hospital={hospital}
        />
      )}
    </div>
  );
};

export default PatientHospitalDetails;