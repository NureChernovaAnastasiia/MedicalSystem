import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/PatientHospitalDetails.module.css';

import iconHospital from '../../img/icons/hospital.png';
import iconAddress from '../../img/icons/address.png';
import iconTelephone from '../../img/icons/telephone.png';
import iconEmail from '../../img/icons/email.png';
import iconSpecialisation from '../../img/icons/specialisation.png';
import iconDoctor from '../../img/icons/doctor.png';
import iconSchedule from '../../img/icons/schedule.png';

import photo1 from '../../img/Woman1.jpg';
import photo2 from '../../img/Man1.jpg';
import { PATIENT_HOSPITALSCHEDULE_ROUTE } from '../../utils/consts';

const doctors = [
  { id: 1, name: 'Петрова Олександра Вікторівна', specialty: 'Кардіолог', experience: '12 років', image: photo1 },
  { id: 2, name: 'Лихненко Віктор Миколайович', specialty: 'Педіатр, Терапевт', experience: '7 років', image: photo2 },
];

const DoctorCard = ({ doctor }) => (
  <div className={styles.doctorCard}>
    <div className={styles.cardHeader}>
      <button className={styles.detailsButton}>
        <span>?</span>
      </button>
    </div>
    <img src={doctor.image} alt="Doctor" className={styles.doctorImage} />
    <div className={styles.doctorInfo}>
      <h2 className={styles.doctorName}>{doctor.name}</h2>
      <InfoItem icon={iconSpecialisation} label={`Спеціальність: ${doctor.specialty}`} />
      <InfoItem icon={iconDoctor} label={`Стаж: ${doctor.experience}`} />
      <div className={styles.infoItem}>
        <img src={iconSchedule} alt="Schedule Icon" className={styles.buttonIcon} />
        <button className={styles.scheduleButton}>Записатися</button>
      </div>
    </div>
  </div>
);

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

const ServiceList = ({ items }) => (
  <div className={styles.scrollableList}>
    <div className={styles.scrollContent}>
      {items.map((item, index) => (
        <div key={index} className={styles.itemCard}>
          <div>{item.title}</div>
          <div>{item.price}</div>
          <button>Замовити</button>
        </div>
      ))}
    </div>
  </div>
);

const PatientHospitalDetails = () => {
  const analyses = Array(20).fill({ title: 'Аналіз крові', price: '350 грн' });
  const services = Array(20).fill({ title: 'Консультація', price: '500 грн' });

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.headerBox}>
          <div className={styles.hospitalNameBlock}>
            <img src={iconHospital} alt="Hospital Icon" className={styles.hospitalIcon} />
            <span className={styles.hospitalName}>Амбулаторія сімейної медицини "Цінність"</span>
          </div>

          <div className={styles.middleRow}>
            <div className={styles.clinicType}>Приватна клініка</div>
            <div className={styles.schedule}>Пн-Сб-08:00-20:00, Нд-вихідний</div>
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.leftSide}>
              <div className={styles.addressBox}>
                <img src={iconAddress} alt="Address Icon" className={styles.iconSmall} />
                <span className={styles.address}>Київ, вул. Єфремова Академіка, 8А</span>
              </div>
            </div>

            <div className={styles.rightSide}>
              <ContactInfo icon={iconTelephone} text="+380671234567" />
              <ContactInfo icon={iconEmail} text="tcinnistamb@gmail.com" />
            </div>
          </div>
        </div>
      </div>

      <h2 className={styles.servicesTitle}>Наші послуги</h2>
      <div className={styles.servicesContainer}>
        <ServiceList items={analyses} />
        <ServiceList items={services} />
      </div>

      <div className={styles.doctorTitle}>
        <h2 className={styles.sectionTitle}>Наші лікарі</h2>
        <NavLink to={PATIENT_HOSPITALSCHEDULE_ROUTE} className={styles.scheduleLink}>Розклад прийому лікарів</NavLink>
      </div>

      <div className={styles.doctorGrid}>
        {doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor} />)}
      </div>
    </div>
  );
};

export default PatientHospitalDetails;
