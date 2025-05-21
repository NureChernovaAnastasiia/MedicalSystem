import React, { useEffect, useState, useMemo } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/PatientHospitalSchedule.module.css';

import iconHospital from '../../img/icons/hospital.png';
import iconAddress from '../../img/icons/address.png';
import iconTelephone from '../../img/icons/telephone.png';
import iconEmail from '../../img/icons/email.png';
import { PATIENT_DOCAPPOINTMENT_ROUTE } from '../../utils/consts';

import { fetchHospitalById } from '../../http/hospitalAPI';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import { fetchDoctorWorkingHoursByIdAndDate } from '../../http/doctorScheduleAPI';

const daysUa = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота', 'Неділя'];

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

const ContactInfo = ({ icon, text }) => (
  <div className={styles.contactItem}>
    <img src={icon} alt="Icon" className={styles.iconSmall} />
    <span className={styles.contactText}>{text}</span>
  </div>
);

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

  if (loading) return <div>Завантаження...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!hospital) return <div>Лікарня не знайдена</div>;

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.headerBox}>
          <div className={styles.hospitalNameBlock}>
            <img src={iconHospital} alt="Hospital Icon" className={styles.hospitalIcon} />
            <span className={styles.hospitalName}>{hospital.name}</span>
          </div>

          <div className={styles.middleRow}>
            <div className={styles.clinicType}>{hospital.type} лікарня</div>
            <div className={styles.schedule}>{hospital.working_hours}</div>
          </div>

          <div className={styles.headerInfo}>
            <div className={styles.leftSide}>
              <ContactInfo icon={iconAddress} text={hospital.address} />
            </div>
            <div className={styles.rightSide}>
              <ContactInfo icon={iconTelephone} text={hospital.phone} />
              <ContactInfo icon={iconEmail} text={hospital.email} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.scheduleContainer}>
        <p className={styles.subtitle}>
          Нижче представлений графік прийому лікарів на поточний тиждень.
        </p>

        <div className={styles.scheduleWrapper}>
          <div className={styles.dayHeader}>
            <div className={styles.emptyCell}></div>
            {daysUa.map((day, i) => (
              <div key={day} className={styles.dayItem}>
                <div>{day}</div>
              </div>
            ))}
          </div>

          <div className={styles.scheduleTable}>
            {doctors.map((doctor) => (
              <div key={doctor.id} className={styles.scheduleRow}>
                <div className={styles.doctorName}>{doctor.last_name} {doctor.first_name?.charAt(0)}.{doctor.middle_name?.charAt(0)}.</div>
                {weekDates.map((date) => {
                  const time = workingHours[doctor.id]?.[date];
                  return (
                    <div key={date} className={styles.scheduleCell}>
                      {time && time.start_time && time.end_time
                        ? `${time.start_time.slice(0, 5)} - ${time.end_time.slice(0, 5)}`
                        : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
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
