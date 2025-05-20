import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/PatientHospitalDetails.module.css';

import { Context } from '../../index';
import { fetchPatientByUserId } from '../../http/patientAPI';
import { fetchHospitalById } from '../../http/hospitalAPI';
import { getHospitalLabServicesByHospitalId } from '../../http/analysisAPI';
import { getHospitalMedicalServicesByHospitalId } from '../../http/servicesAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';

import iconHospital from '../../img/icons/hospital.png';
import iconAddress from '../../img/icons/address.png';
import iconTelephone from '../../img/icons/telephone.png';
import iconEmail from '../../img/icons/email.png';
import iconSpecialisation from '../../img/icons/specialisation.png';
import iconDoctor from '../../img/icons/doctor.png';
import iconSchedule from '../../img/icons/schedule.png';
import { PATIENT_HOSPITALSCHEDULE_ROUTE } from '../../utils/consts';


const DoctorCard = ({ doctor }) => {
  const experienceYears = doctor.experience_start_date
    ? new Date().getFullYear() - new Date(doctor.experience_start_date).getFullYear()
    : '—';

  return (
  <div className={styles.doctorCard}>
    <div className={styles.cardHeader}>
      <button className={styles.detailsButton}><span>?</span></button>
    </div>
    <img src={doctor.photo_url} alt="Doctor" className={styles.doctorImage} />
    <div className={styles.doctorInfo}>
      <h2 className={styles.doctorName}>{doctor.last_name} {doctor.first_name} {doctor.middle_name}</h2>
      <InfoItem icon={iconSpecialisation} label={`Спеціальність: ${doctor.specialization}`} />
      <InfoItem icon={iconDoctor} label={`Стаж: ${experienceYears} років`} />
      <div className={styles.infoItem}>
        <img src={iconSchedule} alt="Schedule Icon" className={styles.buttonIcon} />
        <button className={styles.scheduleButton}>Записатися</button>
      </div>
    </div>
  </div>
)};

const InfoItem = ({ icon, label }) => (
  <div className={styles.infoItem}>
    <img src={icon} alt="Info Icon" className={styles.infoIcon} />
    <p>{label}</p>
  </div>
);

const ContactInfo = ({ icon, text }) => (
  <div className={styles.contactItem}>
    <img src={icon} alt="Icon" className={styles.iconSmall} />
    <span className={styles.contactText}>{text}</span>
  </div>
);

const ServiceList = ({ items }) => {
  if (!items || items.length === 0) return <p>Немає даних для відображення</p>;

  return (
    <div className={styles.scrollableList}>
      <div className={styles.scrollContent}>
        {items.map((item) => {
          const isMedical = !!item.MedicalServiceInfo;
          const serviceInfo = isMedical ? item.MedicalServiceInfo : item.LabTestInfo;

          const title = serviceInfo?.name || 'Без назви';
          const priceValue = serviceInfo?.price;
          const price = priceValue != null ? `${Math.round(priceValue)} грн` : 'Ціна відсутня';

          return (
            <div key={item.id} className={styles.itemCard}>
              <div>{title}</div>
              <div>{price}</div>
              <button className={styles.orderButton}>Замовити</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PatientHospitalDetails = () => {
  const { user } = useContext(Context);
  const [hospital, setHospital] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

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
      {hospital && (
        <div className={styles.headerContainer}>
          <div className={styles.headerBox}>
            <div className={styles.hospitalNameBlock}>
              <img src={iconHospital} alt="Hospital Icon" className={styles.hospitalIcon} />
              <span className={styles.hospitalName}>{hospital.name}</span>
            </div>

            <div className={styles.middleRow}>
              <div className={styles.clinicType}>{hospital.type} лікарня</div>
              <div className={styles.schedule}>{hospital.schedule}</div>
            </div>

            <div className={styles.headerInfo}>
              <div className={styles.leftSide}>
                <div className={styles.addressBox}>
                  <img src={iconAddress} alt="Address Icon" className={styles.iconSmall} />
                  <span className={styles.address}>{hospital.address}</span>
                </div>
              </div>

              <div className={styles.rightSide}>
                <ContactInfo icon={iconTelephone} text={hospital.phone} />
                <ContactInfo icon={iconEmail} text={hospital.email} />
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className={styles.servicesTitle}>Наші послуги</h2>
      <div className={styles.servicesContainer}>
        <ServiceList items={analyses} />
        <ServiceList items={services} />
      </div>

      <div className={styles.doctorTitle}>
        <h2 className={styles.sectionTitle}>Наші лікарі</h2>
        <NavLink to={PATIENT_HOSPITALSCHEDULE_ROUTE} className={styles.scheduleLink}>
          Розклад прийому лікарів
        </NavLink>
      </div>

      <div className={styles.doctorGrid}>
        {doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)}
      </div>
    </div>
  );
};

export default PatientHospitalDetails;