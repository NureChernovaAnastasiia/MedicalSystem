import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../style/PatientDoctorAppointment.module.css';
import { PATIENT_DOCSCHEDULE_ROUTE } from '../../utils/consts';
import { fetchAllDoctors } from '../../http/doctorAPI';
import ModalDocInformation from '../../components/modals/ModalDocInformation';

import iconSearch from '../../img/icons/search.png';
import iconSpecialisation from '../../img/icons/specialisation.png';
import iconHospital from '../../img/icons/hospital.png';
import iconLocation from '../../img/icons/location.png';
import iconSchedule from '../../img/icons/schedule.png';

const DoctorCard = ({ doctor, onOpenModal }) => (
  <div className={styles.doctorCard}>
    <div className={styles.cardHeader}>
      <button className={styles.detailsButton} onClick={() => onOpenModal(doctor)}>
        <span>?</span> Детальніше про лікаря
      </button>
    </div>
    {doctor.photo_url ? (
      <img src={doctor.photo_url} alt="Doctor" className={styles.doctorImage} />
    ) : (
      <div className={styles.noPhotoCircle}>Немає фото</div>
    )}
    <div className={styles.doctorInfo}>
      <h2 className={styles.doctorName}>
        {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`}
      </h2>
      <div className={styles.infoItem}>
        <img src={iconSpecialisation} alt="Speciality Icon" className={styles.infoIcon} />
        <p><strong>Спеціальність:</strong> {doctor.specialization}</p>
      </div>
      <div className={styles.infoItem}>
        <img src={iconHospital} alt="Hospital Icon" className={styles.infoIcon} />
        <p><strong>Лікарня:</strong> {doctor.Hospital?.name}</p>
      </div>
      <div className={styles.infoItem}>
        <img src={iconLocation} alt="Location Icon" className={styles.infoIcon} />
        <p><strong>Місто:</strong> {doctor.Hospital?.address}</p>
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
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const cities = [
    "Київ", "Харків", "Одеса", "Дніпро", "Львів", "Запоріжжя", "Івано-Франківськ", "Чернівці",
    "Ужгород", "Луцьк", "Рівне", "Тернопіль", "Хмельницький", "Вінниця", "Житомир", "Чернігів",
    "Суми", "Полтава", "Кропивницький", "Черкаси", "Миколаїв", "Херсон"
  ];

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const data = await fetchAllDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error("Не вдалося завантажити лікарів", error);
      }
    };
    getDoctors();
  }, []);

  const handleSearch = () => {
    const nameQuery = searchName.toLowerCase().trim();
    const cityQuery = searchCity.toLowerCase().trim();

    const results = doctors.filter((doc) => {
      const fullName = `${doc.first_name} ${doc.last_name} ${doc.middle_name}`.toLowerCase();
      const doctorCity = doc.Hospital?.address?.toLowerCase() || '';
      return (
        fullName.includes(nameQuery) &&
        (cityQuery === '' || doctorCity.includes(cityQuery))
      );
    });

    setFilteredDoctors(results);
  };

  const handleOpenModal = (doctor) => setSelectedDoctor(doctor);
  const handleCloseModal = () => setSelectedDoctor(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Запис до лікаря</h1>

      <div className={styles.searchBlock}>
        <div className={styles.searchFieldWrapper}>
          <img src={iconSearch} alt="Search Icon" className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Введіть ім'я лікаря"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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

          <select
            className={styles.select}
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          >
            <option value="">Місто</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <button className={styles.searchButton} onClick={handleSearch}>
            Знайти
          </button>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <p className={styles.noResults}>За результатами пошуку нічого не знайдено.</p>
      ) : (
        filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onOpenModal={handleOpenModal} />
        ))
      )}

      {selectedDoctor && (
        <ModalDocInformation doctor={selectedDoctor} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default PatientDoctorAppointment;
