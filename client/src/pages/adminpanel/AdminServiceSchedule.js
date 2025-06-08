import React, { useEffect, useState, useCallback } from "react";
import { useParams } from 'react-router-dom';
import styles from "../../style/adminpanel/AdminDoctorSchedule.module.css";
import { daysOfWeekShort } from '../../constants/daysOfWeek';
import ModalScheduleDetail from "../../components/modals/ModalScheduleDetail"; 
import ModalCreateServiceSchedule from "../../components/modals/ModalCreateServiceSchedule";
import ConfirmModal from '../../components/elements/ConfirmModal';

import { getAvailableLabTestTimes, getLabTestScheduleById, deleteLabTestScheduleById } from "../../http/analysisScheduleAPI"; 
import { getAvailableMedicalServiceTimes, getMedicalServiceScheduleById, deleteMedicalServiceScheduleById } from "../../http/servicesScheduleAPI"; 

const SERVICE_API = {
  analysis: {
    getAvailableTimes: getAvailableLabTestTimes,
    getScheduleById: getLabTestScheduleById,
    deleteScheduleById: deleteLabTestScheduleById,
    label: "Лабораторний тест"
  },
  service: {
    getAvailableTimes: getAvailableMedicalServiceTimes,
    getScheduleById: getMedicalServiceScheduleById,
    deleteScheduleById: deleteMedicalServiceScheduleById,
    label: "Медична послуга"
  }
};

const AdminServiceSchedule = () => {
  const [weekData, setWeekData] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { serviceType, id } = useParams();
  const entityId = Number(id);

  const api = SERVICE_API[serviceType];

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const fetchSlotsByType = useCallback(async (id, date) => {
    if (!api) throw new Error(`Невідомий тип послуги: ${serviceType}`);
    return await api.getAvailableTimes(id, date);
  }, [api, serviceType]);

  const loadSchedule = useCallback(async () => {
    if (!api) return;

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
        const slots = await fetchSlotsByType(entityId, apiDate);
        const formattedSlots = slots
          .sort((a, b) => a.start_time.localeCompare(b.start_time))
          .map(slot => ({
            time: `${formatTime(slot.start_time)}-${formatTime(slot.end_time)}`,
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
  }, [entityId, fetchSlotsByType, api]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleSlotClick = async (slot) => {
    if (!api) return;
    try {
      const fullSchedule = await api.getScheduleById(slot.id);
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
    if (!selectedSchedule || !api) return;

    try {
      setDeleteLoading(true);
      await api.deleteScheduleById(selectedSchedule.id);
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

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Розклад надання</h1>
        <div className={styles.orderButtonWrapper}>
          <button className={styles.orderButton} onClick={openCreateModal}>Додати розклад</button>
        </div>
      </div>
      <h4 className={styles.subtitle}>
        {api ? api.label : ""}
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
                    onClick={() => slot.active && handleSlotClick(slot)}
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

      {isCreateModalOpen && (
        <ModalCreateServiceSchedule
          id={entityId}
          type={serviceType}
          onClose={closeCreateModal}
          onSubmit={loadSchedule}
        />
      )}
    </div>
  );
};

export default AdminServiceSchedule;
