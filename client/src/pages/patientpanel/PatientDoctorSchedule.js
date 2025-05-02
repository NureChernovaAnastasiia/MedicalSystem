import React, { useEffect, useState } from "react";
import styles from "../../style/PatientDoctorSchedule.module.css";
import { fetchDoctorScheduleByIdAndDate } from "../../http/doctorScheduleAPI";

const daysOfWeekShort = ["Нд.", "Пн.", "Вт.", "Ср.", "Чт.", "Пт.", "Сб."];

const PatientDoctorSchedule = () => {
  const [weekDates, setWeekDates] = useState([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  
  const doctorId = 1; // Тимчасово статичний ID

  useEffect(() => {
    const initializeSchedule = async () => {
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
    };
  
    initializeSchedule();
  }, []);
  

  const selectDate = async (index, apiDate) => {
    setSelectedDateIndex(index);
    await loadTimeSlots(apiDate);
  };

  const loadTimeSlots = async (apiDate) => {
    try {
      const slots = await fetchDoctorScheduleByIdAndDate(doctorId, apiDate);
      const formattedSlots = slots.map(slot => ({
        time: `${slot.start_time.slice(0, 5)}-${slot.end_time.slice(0, 5)}`,
        active: !slot.is_booked,
        id: slot.id,
      }));
      setTimeSlots(formattedSlots);
    } catch (error) {
      console.error("Помилка при завантаженні слотів:", error);
    }
  };

  const handleDateClick = (index) => {
    const selectedDate = weekDates[index].apiDate;
    selectDate(index, selectedDate);
  };

  const handleSlotClick = (slotId) => {
    console.log(`Обрано слот з id: ${slotId}`);
  };

  return (
    <div className={styles.scheduleContainer}>
      <h1 className={styles.title}>Розклад прийомів</h1>
      <h4 className={styles.subtitle}>Прізвище Ім’я | Спеціалізація | Лікарня</h4>

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
                onClick={slot.active ? () => handleSlotClick(slot.id) : undefined}
              >
                {slot.time}
              </div>
            ))
          ) : (
            <div className={styles.noSlotsMessage}>Немає доступних слотів</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientDoctorSchedule;
