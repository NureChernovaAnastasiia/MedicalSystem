import React, { useState, useEffect } from 'react';
import styles from '../../style/modalstyle/ModalCreateAppointment.module.css';
import { fetchPatientsByDoctorId } from '../../http/patientAPI';
import { fetchDoctorScheduleByIdAndDate } from '../../http/doctorScheduleAPI';
import { createAppointment } from '../../http/appointmentAPI'; 
import AlertPopup from "../../components/elements/AlertPopup";

const ModalCreateAppointment = ({ doctorId, onClose, onCreate }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [comment, setComment] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    (async () => {
      try {
        const data = await fetchPatientsByDoctorId(doctorId);
        setPatients(data);
      } catch (error) {
        console.error('Не вдалося завантажити пацієнтів', error);
      }
    })();
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate || !doctorId) return;
    (async () => {
        try {
        const slots = await fetchDoctorScheduleByIdAndDate(doctorId, selectedDate);

        const sortedSlots = slots.sort((a, b) => a.start_time.localeCompare(b.start_time));

        setTimeSlots(
            sortedSlots.map(({ start_time, end_time, is_booked, id }) => ({
            time: `${start_time.slice(0, 5)}-${end_time.slice(0, 5)}`,
            active: !is_booked,
            id,
            }))
        );
        setSelectedSlot(null);
        } catch (error) {
        console.error('Помилка при завантаженні слотів:', error);
        setTimeSlots([]);
        }
    })();
    }, [selectedDate, doctorId]);

  useEffect(() => {
    if (!doctorId) return;
    (async () => {
      const today = new Date();
      const daysToCheck = 10;

      const datesToCheck = Array.from({ length: daysToCheck }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      const available = [];
      for (const date of datesToCheck) {
        try {
          const slots = await fetchDoctorScheduleByIdAndDate(doctorId, date);
          if (slots.some(slot => !slot.is_booked)) {
            available.push(date);
          }
        } catch (err) {
          console.error(`Помилка при перевірці дати ${date}:`, err);
        }
      }
      setAvailableDates(available);
    })();
  }, [doctorId]);

  const handleCreate = async () => {
    if (!selectedPatient || !selectedDate || !selectedSlot) return;

    setLoading(true);
    setError(null);
    try {
      const data = await createAppointment({
        patient_id: selectedPatient.id,
        doctor_id: doctorId,
        doctor_schedule_id: selectedSlot.id,
        notes: comment,
      });

      setAlert({ message: "Запис успішно створено", type: "success" });

      setTimeout(() => {
        if (onCreate) onCreate(data);
        onClose();
        resetForm();
    }, 1200);
    } catch (err) {
      console.error('Помилка при створенні прийому:', err);
      setAlert({ message: 'Не вдалося створити прийом. Спробуйте пізніше.', type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setSelectedDate('');
    setSelectedSlot(null);
    setComment('');
  };

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.last_name} ${p.first_name} ${p.middle_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                <h1 className={styles.title}>Запис на прийом</h1>
                </div>

                <div className={styles.topSection}>
                <div className={styles.leftSection}>
                    <label htmlFor="searchPatient" className={styles.sectionTitle}>Оберіть пацієнта</label>
                    <input
                    id="searchPatient"
                    type="text"
                    className={styles.searchInput}
                    placeholder="Введіть ПІБ пацієнта"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className={styles.patientList}>
                    {filteredPatients.map(p => (
                        <div
                        key={p.id}
                        className={`${styles.patientCard} ${selectedPatient?.id === p.id ? styles.selected : ''}`}
                        onClick={() => setSelectedPatient(p)}
                        >
                        <div className={styles.patientName}>
                            {`${p.last_name} ${p.first_name} ${p.middle_name || ''}`}
                        </div>
                        <div className={styles.patientDate}>
                            {new Date(p.birth_date).toLocaleDateString()}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <label htmlFor="dateSelect" className={styles.sectionTitle}>Оберіть дату</label>
                    <select
                    id="dateSelect"
                    className={styles.dateSelector}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    >
                    <option value="">Оберіть дату</option>
                    {availableDates.map(date => (
                        <option key={date} value={date}>
                        {new Date(date).toLocaleDateString()}
                        </option>
                    ))}
                    </select>

                    <label className={styles.sectionSubtitle} style={{ marginTop: '20px' }}>Можливий час для запису</label>
                    <div className={styles.timeSlotsGrid}>
                    {timeSlots.length > 0 ? (
                        timeSlots.map(slot => (
                        <div
                            key={slot.id}
                            className={`${styles.timeSlot} ${slot.active ? styles.availableSlot : styles.unavailableSlot} ${selectedSlot?.id === slot.id ? styles.selectedSlot : ''}`}
                            onClick={slot.active ? () => setSelectedSlot(slot) : undefined}
                        >
                            {slot.time}
                        </div>
                        ))
                    ) : (
                        <div className={styles.noSlotsMessage}>Немає доступних слотів</div>
                    )}
                    </div>
                </div>
                </div>

                <div className={styles.bottomSection}>
                <div className={styles.selectedInfo}>
                    <h3><strong>Обрані дані: </strong>
                    {selectedPatient ? `${selectedPatient.last_name} ${selectedPatient.first_name} ${selectedPatient.middle_name || ''}` : 'Не обрано'}, 
                    {selectedSlot ? ` ${selectedSlot.time}` : ' Не обрано'}
                    </h3>
                </div>

                <div className={styles.commentSection}>
                    <label htmlFor="commentTextarea" className={styles.commentLabel}>Додати коментар до запису?</label>
                    <textarea
                    id="commentTextarea"
                    className={styles.commentTextarea}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ваш коментар..."
                    />
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
                </div>

                <div className={styles.footerButtons}>
                <button className={styles.cancelButton} onClick={onClose} disabled={loading}>
                    <span className={styles.closeIcon}>×</span>
                    <span className={styles.closeText}>Скасувати</span>
                </button>
                <button
                    className={styles.createButton}
                    onClick={handleCreate}
                    disabled={!selectedPatient || !selectedDate || !selectedSlot || loading}
                >
                    <span className={styles.createIcon}>✓</span>
                    <span className={styles.createText}>{loading ? 'Створення...' : 'Створити'}</span>
                </button>
                </div>
            </div>
        </div>
    </>
  );
};

export default ModalCreateAppointment;
