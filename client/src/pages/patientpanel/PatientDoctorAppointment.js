import React, { useState, useEffect } from 'react';
import styles from '../../style/PatientDoctorAppointment.module.css';
import { CITIES } from '../../constants/cities';
import DoctorCard from '../../components/elements/DoctorCard';
import ModalDocInformation from '../../components/modals/ModalDocInformation';
import iconSearch from '../../img/icons/search.png';

import {
  fetchAllDoctors,
  fetchDoctorSpecializations,
  fetchUniqueHospitalNames,
} from '../../http/doctorAPI';

const PatientDoctorAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchHospital, setSearchHospital] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [doctorsData, specData, hospitalData] = await Promise.all([
          fetchAllDoctors(),
          fetchDoctorSpecializations(),
          fetchUniqueHospitalNames(),
        ]);
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        setSpecializations(specData);
        setHospitals(hospitalData);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
      }
    };
    loadData();
  }, []);

  const handleSearch = () => {
    const nameQuery = searchName.toLowerCase().trim();
    const cityQuery = searchCity.toLowerCase();
    const hospitalQuery = searchHospital.toLowerCase();
    const specializationQuery = searchSpecialization.toLowerCase();

    const results = doctors.filter((doc) => {
      const fullName = `${doc.first_name} ${doc.last_name} ${doc.middle_name}`.toLowerCase();
      const docCity = doc.Hospital?.address?.toLowerCase() || '';
      const docHospital = doc.Hospital?.name?.toLowerCase() || '';
      const docSpec = doc.specialization?.toLowerCase() || '';

      return (
        fullName.includes(nameQuery) &&
        (cityQuery === '' || docCity.includes(cityQuery)) &&
        (hospitalQuery === '' || docHospital.includes(hospitalQuery)) &&
        (specializationQuery === '' || docSpec.includes(specializationQuery))
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
          <select
            className={styles.select}
            value={searchSpecialization}
            onChange={(e) => setSearchSpecialization(e.target.value)}
          >
            <option value="">Категорія лікаря</option>
            {specializations.map((spec, index) => (
              <option key={index} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            className={styles.select}
            value={searchHospital}
            onChange={(e) => setSearchHospital(e.target.value)}
          >
            <option value="">Лікарня</option>
            {hospitals.map((hospital, index) => (
              <option key={index} value={hospital}>{hospital}</option>
            ))}
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
