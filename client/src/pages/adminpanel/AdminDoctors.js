import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';

import SearchInput from '../../components/options/SearchInput';
import SearchBySpecialization from '../../components/options/SearchBySpecialization';
import SearchByPosition from '../../components/options/SearchByPosition';
import DoctorItem from '../../components/doctor/DoctorItem';
import StaffItem from '../../components/hospitalstaff/StaffItem';
import ModalRegistrationDocStaff from '../../components/modals/ModalRegistrationDocStaff';
import TabButtons from '../../components/navbars/TabButtons';
import Loader from '../../components/elements/Loader';

import styles from '../../style/adminpanel/AdminDoctors.module.css';

import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import { fetchNonDoctorsByHospitalId } from '../../http/hospitalStaffAPI';

const AdminDoctors = () => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [doctors, setDoctors] = useState([]);
  const [staff, setStaff] = useState([]);
  const [activeTab, setActiveTab] = useState('doctors');
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [searchStaffTerm, setSearchStaffTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadDoctors = useCallback(async () => {
    if (!hospitalId) return;
    try {
      setLoading(true);
      const data = await fetchDoctorsByHospitalId(hospitalId);
      setDoctors(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити лікарів');
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  const loadStaff = useCallback(async () => {
    if (!hospitalId) return;
    try {
      setLoading(true);
      const data = await fetchNonDoctorsByHospitalId(hospitalId);
      setStaff(data);
      setError(null);
    } catch {
      setError('Не вдалося завантажити медичний персонал');
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    activeTab === 'doctors' ? loadDoctors() : loadStaff();
  }, [activeTab, loadDoctors, loadStaff]);

  const filteredDoctors = doctors.filter((doctor) => {
    const fullName = `${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`.toLowerCase();
    const specialization = (doctor.specialization || '').toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) &&
      (!searchSpecialization || specialization.includes(searchSpecialization.toLowerCase()))
    );
  });

  const filteredStaff = staff.filter((person) => {
    const fullName = `${person.last_name} ${person.first_name} ${person.middle_name}`.toLowerCase();
    const position = (person.position || '').toLowerCase();
    return (
      fullName.includes(searchStaffTerm.toLowerCase()) &&
      (!searchPosition || position.includes(searchPosition.toLowerCase()))
    );
  });

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Персонал</h1>
        <div className={styles.orderButtonWrapper}>
          <button className={styles.orderButton} onClick={() => setIsModalOpen(true)}>
            Зареєструвати робітника
          </button>
        </div>
      </div>

      <TabButtons
        tabs={[
          { key: 'doctors', label: 'Лікарі' },
          { key: 'staff', label: 'Медичний персонал' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className={styles.tabButton}
        activeClassName={styles.active}
        wrapperClassName={styles.tabButtons}
      />

      {activeTab === 'doctors' ? (
        <>
          <div className={styles.filterRow}>
            <div className={styles.datePickerWrapper}>
              <SearchBySpecialization value={searchSpecialization} onChange={setSearchSpecialization} />
            </div>
            <div className={styles.searchBox}>
              <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Введіть ПІБ лікаря" />
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
          </div>
        </>
      ) : (
        <>
          <div className={styles.filterRow}>
            <div className={styles.datePickerWrapper}>
              <SearchByPosition value={searchPosition} onChange={setSearchPosition} />
            </div>
            <div className={styles.searchBox}>
              <SearchInput
                value={searchStaffTerm}
                onChange={setSearchStaffTerm}
                placeholder="Введіть ПІБ працівника"
              />
            </div>
          </div>

          <div className={styles.tableHeader}>
            <span>ПІБ</span>
            <span>Посада</span>
            <span>Email</span>
          </div>

          <div className={styles.cardsGrid}>
            {filteredStaff.length ? (
              filteredStaff.map((person) => (
                <StaffItem key={person.id} person={person} />
              ))
            ) : (
              <p className={styles.noResults}>Персонал не знайдено</p>
            )}
          </div>
        </>
      )}

      {isModalOpen && (
        <ModalRegistrationDocStaff
          onClose={() => setIsModalOpen(false)}
          onRegister={(data) => {
            setIsModalOpen(false);
          }}
        />
      )}

    </div>
  );
};

export default AdminDoctors;
