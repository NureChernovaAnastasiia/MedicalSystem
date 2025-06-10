import React, { useEffect, useState, useCallback } from "react";
import { useParams } from 'react-router-dom';
import styles from "../../style/adminpanel/AdminDoctorSchedule.module.css";
import { daysOfWeekShort } from '../../constants/daysOfWeek';
import { fetchDoctorScheduleByIdAndDate, fetchDoctorScheduleById, deleteDoctorScheduleById } from "../../http/doctorScheduleAPI";
import { fetchDoctorById } from "../../http/doctorAPI";
import ModalScheduleDetail from "../../components/modals/ModalScheduleDetail"; 
import ConfirmModal from '../../components/elements/ConfirmModal';
import Loader from "../../components/elements/Loader";

const AdminDoctorSchedule = () => {
  const [weekData, setWeekData] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); 

  const { id } = useParams();
  const doctorId = Number(id);

  const loadSchedule = useCallback(async () => {
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
  }, [doctorId]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleSlotClick = async (slot) => {
    try {
      const fullSchedule = await fetchDoctorScheduleById(slot.id);
      setSelectedSchedule(fullSchedule); 
    } catch (error) {
      console.error("Помилка при завантаженні розкладу:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = () => {
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedSchedule) return;

    try {
      setDeleteLoading(true);
      await deleteDoctorScheduleById(selectedSchedule.id);
      setSelectedSchedule(null);
      await loadSchedule();
    } catch (error) {
      console.error("Помилка при видаленні розкладу:", error);
    } finally {
      setDeleteLoading(false);
      setIsConfirmOpen(false);
    }
  };

  const closeDeleteConfirm = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className={styles.scheduleContainer}>
      <h1 className={styles.title}>Прийоми лікаря</h1>
      <h4 className={styles.subtitle}>
        {doctorInfo
          ? `${doctorInfo.last_name} ${doctorInfo.first_name} | ${doctorInfo.specialization}`
          : <Loader />}
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
                    onClick={() => handleSlotClick(slot)}
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

      {selectedSchedule && (
        <ModalScheduleDetail
          schedule={selectedSchedule}
          onClose={handleCloseModal}
          onDelete={handleDeleteSchedule}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Підтвердження видалення"
        message="Ви дійсно хочете видалити розклад прийому?"
        onConfirm={handleDeleteConfirmed}
        onCancel={closeDeleteConfirm}
        confirmText="Видалити"
        cancelText="Відміна"
        loading={deleteLoading}
      />

    </div>
  );
};

export default AdminDoctorSchedule;
