import React, { useState, useEffect } from 'react';
import styles from '../../style/PatientDoctorAppointment.module.css';
import { CITIES } from '../../constants/cities';
import DoctorCard from '../../components/elements/DoctorCard';
import { fetchAllDoctors } from '../../http/doctorAPI';
import ModalDocInformation from '../../components/modals/ModalDocInformation';

import iconSearch from '../../img/icons/search.png';

const PatientDoctorAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');

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
            {CITIES.map((city) => (
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
