import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';

import SearchInput from '../../components/options/SearchInput';
import SearchBySpecialization from '../../components/options/SearchBySpecialization';
import DoctorItem from '../../components/doctor/DoctorItem';  
import ModalRegisterPatient from '../../components/modals/ModalRegisterPatient'; 

import styles from '../../style/doctorpanel/DoctorPatients.module.css';

import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';

const AdminDoctors = () => {
  const { hospital } = useContext(Context);
  const [doctors, setDoctors] = useState([]);
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadDoctors = useCallback(async () => {
    if (!hospital?.id) return;
    try {
      setLoading(true);
      const data = await fetchDoctorsByHospitalId(1);
      setDoctors(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити лікарів');
    } finally {
      setLoading(false);
    }
  }, [hospital]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullNameLower = (`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}` || '').toLowerCase();
    const specializationLower = (doctor.specialization || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    const searchSpecLower = searchSpecialization.toLowerCase();

    const matchesName = fullNameLower.includes(searchTermLower);
    const matchesSpec = searchSpecLower ? specializationLower.includes(searchSpecLower) : true;

    return matchesName && matchesSpec;
  });

  if (loading) return <div className={styles.loading}>Завантаження...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Лікарі</h1>
        <div className={styles.orderButtonWrapper}>
          <button
            className={styles.orderButton}
            onClick={() => setIsModalOpen(true)}
          >
            Зареєструвати лікаря
          </button>
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.datePickerWrapper}>
          <SearchBySpecialization
            value={searchSpecialization}
            onChange={setSearchSpecialization}
          />
        </div>

        <div className={styles.searchBox}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Введіть ПІБ лікаря"
          />
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>ПІБ лікаря</span>
        <span>Спеціалізація</span>
        <span>Email</span>
      </div>

      <div className={styles.cardsGrid}>
        {filteredDoctors.length ? (
          filteredDoctors.map((doctor) => (
            <DoctorItem key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <p className={styles.noResults}>Лікарів не знайдено</p>
        )}

        {isModalOpen && (
          <ModalRegisterPatient  
            doctor={null}        
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDoctors;
