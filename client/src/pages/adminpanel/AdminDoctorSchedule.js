import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import styles from "../../style/adminpanel/AdminDoctorSchedule.module.css";
import ModalConfirmAppointment from "../../components/modals/ModalConfirmAppointment";
import { daysOfWeekShort } from '../../constants/daysOfWeek';
import { fetchDoctorScheduleByIdAndDate } from "../../http/doctorScheduleAPI";
import { fetchDoctorById } from "../../http/doctorAPI";

const AdminDoctorSchedule = () => {
  const [weekData, setWeekData] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { id } = useParams();
  const doctorId = Number(id);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const doctor = await fetchDoctorById(doctorId);
        setDoctorInfo(doctor);
      } catch (error) {
        console.error("Помилка при завантаженні лікаря:", error);
      }

      const today = new Date();
      const week = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const dayName = daysOfWeekShort[currentDate.getDay()];
        const date = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const year = currentDate.getFullYear();
        const apiDate = `${year}-${month}-${date}`;
        const formattedDate = `${dayName} ${date}.${month}.${year}`;

        try {
          const slots = await fetchDoctorScheduleByIdAndDate(doctorId, apiDate);
          const formattedSlots = slots
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map(slot => ({
            time: `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`,
            active: !slot.is_booked,
            id: slot.id,
          }));
          week.push({
            formattedDate,
            apiDate,
            timeSlots: formattedSlots,
            freeSlots: formattedSlots.filter(slot => slot.active).length
          });
        } catch (error) {
          console.error("Помилка при завантаженні слотів на", apiDate, error);
          week.push({ formattedDate, apiDate, timeSlots: [], freeSlots: 0 });
        }
      }

      setWeekData(week);
    };

    loadSchedule();
  }, [doctorId]);

  const handleSlotClick = (slot, day) => {
    setSelectedSlot({ ...slot, date: day.formattedDate });
  };

  return (
    <div className={styles.scheduleContainer}>
      <h1 className={styles.title}>Прийоми лікаря</h1>
      <h4 className={styles.subtitle}>
        {doctorInfo
          ? `${doctorInfo.last_name} ${doctorInfo.first_name} | ${doctorInfo.specialization}`
          : "Завантаження інформації..."}
      </h4>

      <div className={styles.calendarWrapper}>
        {weekData.map((day, index) => (
          <div key={index} className={styles.calendarContainer}>
            <div className={styles.card}>
              <div className={styles.dayName}>{day.formattedDate}</div>
              <span className={styles.slotsInfo}>
                {day.freeSlots > 0 ? `${day.freeSlots} вільних` : "Немає вільних"}
              </span>
            </div>

            <div className={styles.timeSlotsGrid}>
              {day.timeSlots.length > 0 ? (
                day.timeSlots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`${styles.timeSlot} ${slot.active ? styles.availableSlot : styles.unavailableSlot}`}
                    onClick={slot.active ? () => handleSlotClick(slot, day) : undefined}
                  >
                    {slot.time}
                  </div>
                ))
              ) : (
                <div className={styles.noSlotsMessage}>Немає доступних слотів</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSlot && doctorInfo && (
        <ModalConfirmAppointment
          doctor={doctorInfo}
          slot={selectedSlot}
          date={selectedSlot.date}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
};

export default AdminDoctorSchedule;
