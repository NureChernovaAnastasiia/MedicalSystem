import React, { useState, useEffect, useContext } from 'react';
import styles from '../../style/modalstyle/ModalCreateAppointment.module.css';
import { fetchPatientsByDoctorId } from '../../http/patientAPI';
import { fetchDoctorScheduleByIdAndDate } from '../../http/doctorScheduleAPI';
import { createAppointment } from '../../http/appointmentAPI'; 
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI'; 
import { Context } from "../../index"; 
import AlertPopup from "../../components/elements/AlertPopup";

const ModalCreateAppointment = ({ doctorId: defaultDoctorId, onClose, onCreate, defaultPatient = null }) => {
  const { hospital, user } = useContext(Context);
  const role = user?._role;
  const hospitalId = hospital?.hospitalId;

  const [doctorId, setDoctorId] = useState(defaultDoctorId || '');
  const [doctors, setDoctors] = useState([]);

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(defaultPatient);
  const [searchDoctorTerm, setSearchDoctorTerm] = useState('');
  const [comment, setComment] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (role === 'Admin' && hospitalId) {
      fetchDoctorsByHospitalId(hospitalId)
        .then(setDoctors)
        .catch(err => console.error("Не вдалося завантажити лікарів:", err));
    }
  }, [role, hospitalId]);

  useEffect(() => {
    if (!doctorId) return;
    (async () => {
      try {
        const data = await fetchPatientsByDoctorId(doctorId);
        setPatients(data);
        if (defaultPatient && !data.find(p => p.id === defaultPatient.id)) {
          setPatients(prev => [...prev, defaultPatient]);
        }
      } catch (error) {
        console.error('Не вдалося завантажити пацієнтів', error);
      }
    })();
  }, [doctorId, defaultPatient]);

  useEffect(() => {
    if (!selectedDate || !doctorId) return;
    (async () => {
      try {
        const slots = await fetchDoctorScheduleByIdAndDate(doctorId, selectedDate);
        const sortedSlots = slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
        setTimeSlots(sortedSlots.map(({ start_time, end_time, is_booked, id }) => ({
          time: `${start_time.slice(0, 5)}-${end_time.slice(0, 5)}`,
          active: !is_booked,
          id,
        })));
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
    if (!selectedPatient || !selectedDate || !selectedSlot || !doctorId) return;
    setLoading(true);
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

  const selectedDoctor = doctors.find(doc => doc.id === doctorId);

  const filteredPatients = patients.filter(p => {
    const fullName = `${p.last_name} ${p.first_name} ${p.middle_name || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const filteredDoctors = doctors.filter(d => {
    const fullName = `${d.last_name} ${d.first_name} ${d.middle_name || ''}`.toLowerCase();
    return fullName.includes(searchDoctorTerm.toLowerCase());
  });

  return (
    <>
      {alert && <AlertPopup message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h1 className={styles.title}>Запис на прийом</h1>
          </div>

          <div className={`${styles.topSection} ${role === 'Admin' ? styles.threeColumns : styles.twoColumns}`}>
            {role === 'Admin' && (
              <div className={styles.doctorsSection}>
                <label htmlFor="searchDoctor" className={styles.sectionTitle}>Оберіть лікаря</label>
                <input
                  id="searchDoctor"
                  type="text"
                  className={styles.searchInput}
                  placeholder="Введіть ПІБ лікаря"
                  value={searchDoctorTerm}
                  onChange={e => setSearchDoctorTerm(e.target.value)}
                />
                <div className={styles.patientList}>
                  {filteredDoctors.length > 0 ? filteredDoctors.map(doc => (
                    <div
                      key={doc.id}
                      className={`${styles.patientCard} ${doctorId === doc.id ? styles.selected : ''}`}
                      onClick={() => setDoctorId(doc.id)}
                    >
                      <div className={styles.patientName}>
                        {`${doc.last_name} ${doc.first_name} ${doc.middle_name || ''}`}
                      </div>
                    </div>
                  )) : <div>Лікарів не знайдено</div>}
                </div>
              </div>
            )}

            <div className={styles.leftSection}>
              <label htmlFor="searchPatient" className={styles.sectionTitle}>Оберіть пацієнта</label>
              <input
                id="searchPatient"
                type="text"
                className={styles.searchInput}
                placeholder="Введіть ПІБ пацієнта"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!defaultPatient}
              />
              <div className={styles.patientList}>
                {filteredPatients.map(p => (
                  <div
                    key={p.id}
                    className={`${styles.patientCard} ${selectedPatient?.id === p.id ? styles.selected : ''}`}
                    onClick={() => !defaultPatient && setSelectedPatient(p)}
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
                {role === 'Admin' && (
                  <>
                    {selectedDoctor ? `${selectedDoctor.last_name} ${selectedDoctor.first_name} ${selectedDoctor.middle_name || ''}` : 'Не обрано'}, 
                  </>
                )}
                {selectedPatient ? `${selectedPatient.last_name} ${selectedPatient.first_name} ${selectedPatient.middle_name || ''}` : ' Не обрано'}, 
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
          </div>

          <div className={styles.footerButtons}>
            <button className={styles.cancelButton} onClick={onClose} disabled={loading}>
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
            <button
              className={styles.createButton}
              onClick={handleCreate}
              disabled={!selectedPatient || !selectedDate || !selectedSlot || !doctorId || loading}
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
