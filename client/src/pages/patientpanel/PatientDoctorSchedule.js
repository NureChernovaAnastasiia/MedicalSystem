import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "../../style/patientpanel/PatientDoctorSchedule.module.css";
import ModalConfirmAppointment from "../../components/modals/ModalConfirmAppointment";
import { daysOfWeekShort } from '../../constants/daysOfWeek';
import { fetchDoctorScheduleByIdAndDate } from "../../http/doctorScheduleAPI";
import { fetchDoctorById } from "../../http/doctorAPI";

const PatientDoctorSchedule = () => {
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { id } = useParams();
  const doctorId = Number(id);

  const loadTimeSlots = useCallback(async (apiDate) => {
    try {
      const slots = await fetchDoctorScheduleByIdAndDate(doctorId, apiDate);
      const formattedSlots = slots
        .sort((a, b) => a.start_time.localeCompare(b.start_time))
        .map(slot => ({
          time: `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`,
          active: !slot.is_booked,
          id: slot.id,
        }));
      setTimeSlots(formattedSlots);
    } catch (error) {
      console.error("Помилка при завантаженні слотів:", error);
    }
  }, [doctorId]);

  const initializeSchedule = useCallback(async () => {
    try {
      const doctor = await fetchDoctorById(doctorId);
      setDoctorInfo(doctor);
    } catch (error) {
      console.error("Помилка при завантаженні інформації про лікаря:", error);
    }

    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayName = daysOfWeekShort[currentDate.getDay()];
      const date = String(currentDate.getDate()).padStart(2, "0");
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const year = currentDate.getFullYear();
      const apiDate = `${year}-${month}-${date}`;

      try {
        const slots = await fetchDoctorScheduleByIdAndDate(doctorId, apiDate);
        const freeSlots = slots.filter(slot => !slot.is_booked).length;

        dates.push({
          formattedDate: `${dayName} ${date}.${month}.${year}`,
          apiDate,
          freeSlots,
        });
      } catch (error) {
        console.error("Помилка при завантаженні дати:", apiDate, error);
        dates.push({
          formattedDate: `${dayName} ${date}.${month}.${year}`,
          apiDate,
          freeSlots: 0,
        });
      }
    }

    setWeekDates(dates);
    if (dates.length > 0) {
      setSelectedDateIndex(0);
      await loadTimeSlots(dates[0].apiDate);
    }
  }, [doctorId, loadTimeSlots]);

  useEffect(() => {
    initializeSchedule();
  }, [initializeSchedule]);

  const handleDateClick = async (index) => {
    const selectedDate = weekDates[index].apiDate;
    setSelectedDateIndex(index);
    await loadTimeSlots(selectedDate);
  };

  const handleSlotClick = (slot) => {
    if (slot.active) {
      setSelectedSlot(slot);
    }
  };

  return (
    <div className={styles.scheduleContainer}>
      <h1 className={styles.title}>Розклад прийомів</h1>
      <p className={styles.subtitle}>
        {doctorInfo
          ? `${doctorInfo.last_name} ${doctorInfo.first_name} | ${doctorInfo.specialization} | ${doctorInfo.Hospital?.name}`
          : "Завантаження інформації..."}
      </p>

      <div className={styles.calendarWrapper}>
        <div className={styles.calendarContainer}>
          {weekDates.map((item, index) => (
            <div
              key={index}
              className={`${styles.card} ${selectedDateIndex === index ? styles.selectedCard : ""}`}
              onClick={() => handleDateClick(index)}
            >
              <div className={styles.dayName}>{item.formattedDate}</div>
              <div className={styles.slotsInfo}>
                {item.freeSlots > 0 ? `${item.freeSlots} вільних` : "Немає вільних"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDateIndex !== null && (
        <div className={styles.timeSlotsGrid}>
          {timeSlots.length > 0 ? (
            timeSlots.map((slot, idx) => (
              <div
                key={idx}
                className={`${styles.timeSlot} ${slot.active ? styles.availableSlot : styles.unavailableSlot}`}
                onClick={() => handleSlotClick(slot)}
              >
                {slot.time}
              </div>
            ))
          ) : (
            <div className={styles.noSlotsMessage}>Немає доступних слотів</div>
          )}
        </div>
      )}

      {selectedSlot && doctorInfo && (
        <ModalConfirmAppointment
          doctor={doctorInfo}
          slot={selectedSlot}
          date={weekDates[selectedDateIndex].formattedDate}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
};

export default PatientDoctorSchedule;
