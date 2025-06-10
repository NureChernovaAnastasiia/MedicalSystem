import React, { useEffect, useState, useMemo, useContext, useCallback } from 'react';
import styles from '../../style/adminpanel/AdminSchedules.module.css';

import { Context } from '../../index'; 
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import { fetchDoctorWorkingHoursByIdAndDate } from '../../http/doctorScheduleAPI';

import DoctorScheduleTable from '../../components/doctor/DoctorScheduleTable';
import ModalCreateDoctorSchedule from '../../components/modals/ModalCreateDoctorSchedule';
import Loader from '../../components/elements/Loader';

const getWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    weekDates.push(date.toISOString().slice(0, 10));
  }
  return weekDates;
};

const AdminSchedules = () => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [doctors, setDoctors] = useState([]);
  const [workingHours, setWorkingHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekDates = useMemo(() => getWeekDates(), []);

  const loadData = useCallback(async () => {
    if (!hospitalId) return;
    try {
      setLoading(true);
      setError(null);

      const doctorsData = await fetchDoctorsByHospitalId(hospitalId);
      setDoctors(doctorsData);

      const hours = {};
      await Promise.all(
        doctorsData.map(async (doctor) => {
          hours[doctor.id] = {};
          await Promise.all(
            weekDates.map(async (date) => {
              try {
                const working = await fetchDoctorWorkingHoursByIdAndDate(doctor.id, date);
                hours[doctor.id][date] = working;
              } catch {
                hours[doctor.id][date] = null;
              }
            })
          );
        })
      );
      setWorkingHours(hours);
    } catch (e) {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  }, [hospitalId, weekDates]); 

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitSchedule = async (scheduleData) => {
    handleCloseModal();
    await loadData(); 
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Розклад прийому лікарів</h1>
        <div className={styles.orderButtonWrapper}>
          <button className={styles.orderButton} onClick={handleOpenModal}>
            Створити новий розклад
          </button>
        </div>
      </div>

      <div className={styles.scheduleContainer}>
        <p className={styles.subtitle}>
          Нижче представлений графік прийому лікарів на поточний тиждень.
        </p>

        <DoctorScheduleTable
          doctors={doctors}
          weekDates={weekDates}
          workingHours={workingHours}
        />
      </div>

      {isModalOpen && (
        <ModalCreateDoctorSchedule
          onClose={handleCloseModal}
          onSubmit={handleSubmitSchedule}
        />
      )}
    </div>
  );
};


export default AdminSchedules;
