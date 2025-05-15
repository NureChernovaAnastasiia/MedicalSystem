import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/PatientDoctorAppointment.module.css';
import { PATIENT_DOCSCHEDULE_ROUTE } from '../../utils/consts';

import ModalDocInformation from '../../components/modals/ModalDocInformation'; 

import iconSearch from '../../img/icons/search.png';
import iconSpecialisation from '../../img/icons/specialisation.png';
import iconHospital from '../../img/icons/hospital.png';
import iconLocation from '../../img/icons/location.png';
import iconSchedule from '../../img/icons/schedule.png';

import photo1 from '../../img/Woman1.jpg';
import photo2 from '../../img/Man1.jpg';

const doctors = [
  {
    id: 1,
    name: 'Петрова Олександра Вікторівна',
    specialty: 'Кардіолог',
    hospital: 'Амбулаторія сімейної медицини "Цінність"',
    city: 'Київ вул. Єфремова Академіка, 8А',
    email: 'dr.petrova@lifeline.com',
    phone: '+380 44 123 4567',
    bio: 'Д-р Олександра Петрова — провідний кардіолог з 12-річним досвідом. Спеціалізується на діагностиці та лікуванні серцево-судинних захворювань.',
    experience: '12 років',
    image: photo1,
  },
  {
    id: 2,
    name: 'Лихненко Віктор Миколайович',
    specialty: 'Педіатр, Терапевт',
    hospital: 'Сімейна клініка "Надія"',
    city: 'Київ',
    email: 'dr.lykhnenko@lifeline.com',
    phone: '+380 44 987 6543',
    bio: 'Д-р Віктор Лихненко — досвідчений педіатр і терапевт. Відомий індивідуальним підходом до кожного пацієнта.',
    experience: '9 років',
    image: photo2,
  },
];

const DoctorCard = ({ doctor, onOpenModal }) => (
  <div className={styles.doctorCard}>
    <div className={styles.cardHeader}>
      <button className={styles.detailsButton} onClick={() => onOpenModal(doctor)}>
        <span>?</span> Детальніше про лікаря
      </button>
    </div>

    <img src={doctor.image} alt="Doctor" className={styles.doctorImage} />

    <div className={styles.doctorInfo}>
      <h2 className={styles.doctorName}>{doctor.name}</h2>

      <div className={styles.infoItem}>
        <img src={iconSpecialisation} alt="Speciality Icon" className={styles.infoIcon} />
        <p><strong>Спеціальність:</strong> {doctor.specialty}</p>
      </div>

      <div className={styles.infoItem}>
        <img src={iconHospital} alt="Hospital Icon" className={styles.infoIcon} />
        <p><strong>Лікарня:</strong> {doctor.hospital}</p>
      </div>

      <div className={styles.infoItem}>
        <img src={iconLocation} alt="Location Icon" className={styles.infoIcon} />
        <p><strong>Місто:</strong> {doctor.city}</p>
      </div>

      <div className={styles.infoItem}>
        <img src={iconSchedule} alt="Schedule Icon" className={styles.buttonIcon} />
        <NavLink to={PATIENT_DOCSCHEDULE_ROUTE} className={styles.scheduleButton}>
          Переглянути розклад
        </NavLink>
      </div>
    </div>
  </div>
);

const PatientDoctorAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Запис до лікаря</h1>

      <div className={styles.searchBlock}>
        <div className={styles.searchFieldWrapper}>
          <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Введіть ім'я лікаря"
            className={styles.inputField}
          />
        </div>

        <div className={styles.selectGroup}>
          <select className={styles.select}>
            <option>Категорія лікаря</option>
          </select>
          <select className={styles.select}>
            <option>Лікарня</option>
          </select>
          <select className={styles.select}>
            <option>Місто</option>
          </select>
          <button className={styles.searchButton}>Знайти</button>
        </div>
      </div>

      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} onOpenModal={handleOpenModal} />
      ))}

      {selectedDoctor && (
        <ModalDocInformation doctor={selectedDoctor} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default PatientDoctorAppointment;
