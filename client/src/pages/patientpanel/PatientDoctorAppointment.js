import React, { useState, useEffect } from 'react';
import styles from '../../style/patientpanel//PatientDoctorAppointment.module.css';
import DoctorCard from '../../components/doctor/DoctorCard';
import ModalDocInformation from '../../components/modals/ModalDocInformation';

import SearchInput from '../../components/options/SearchInput';
import SearchByHospital from '../../components/options/SearchByHospital';
import SearchBySpecialization from '../../components/options/SearchBySpecialization';
import SearchByCity from '../../components/options/SearchByCity';

import { fetchAllDoctors } from '../../http/doctorAPI';

const PatientDoctorAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [searchName, setSearchName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchHospital, setSearchHospital] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsData = await fetchAllDoctors();
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
      } catch (error) {
        console.error("Помилка при завантаженні лікарів:", error);
      }
    };
    loadDoctors();
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
        <SearchInput value={searchName} onChange={setSearchName} placeholder="Введіть ім’я лікаря" />

        <div className={styles.selectGroup}>
          <SearchBySpecialization value={searchSpecialization} onChange={setSearchSpecialization} />
          <SearchByHospital value={searchHospital} onChange={setSearchHospital} />
          <SearchByCity value={searchCity} onChange={setSearchCity} />
          <button className={styles.searchButton} onClick={handleSearch}>Знайти</button>
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

