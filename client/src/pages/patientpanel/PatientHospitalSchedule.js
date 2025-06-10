import React, { useEffect, useState, useMemo } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientHospitalSchedule.module.css';

import { PATIENT_DOCAPPOINTMENT_ROUTE } from '../../utils/consts';

import { fetchHospitalById } from '../../http/hospitalAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import { fetchDoctorWorkingHoursByIdAndDate } from '../../http/doctorScheduleAPI';

import HospitalHeader from '../../components/hospital/HospitalHeader';
import DoctorScheduleTable from '../../components/doctor/DoctorScheduleTable'; 
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

const PatientHospitalSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [workingHours, setWorkingHours] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const weekDates = useMemo(() => getWeekDates(), []);

  const goBack = () => navigate(-1);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const hospitalData = await fetchHospitalById(id);
        setHospital(hospitalData);

        const doctorsData = await fetchDoctorsByHospitalId(id);
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
    };

    if (id) loadData();
  }, [id, weekDates]);

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!hospital) return <div>Лікарня не знайдена</div>;

  return (
    <div className={styles.container}>
      <HospitalHeader hospital={hospital} />

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

      <div className={styles.docAppointment}>
        <p className={styles.subtitle}>Хочете знайти лікаря за спеціальністю?</p>
        <NavLink to={PATIENT_DOCAPPOINTMENT_ROUTE}>
          <button className={styles.orderButton}>Записатися до лікаря</button>
        </NavLink>
      </div>

      <div className={styles.backLink}>
        <button onClick={goBack} className={styles.backButton}>
          ‹ Повернутися назад до списку аналізів
        </button>
      </div>
    </div>
  );
};

export default PatientHospitalSchedule;
