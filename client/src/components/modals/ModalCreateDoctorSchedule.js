import React, { useState, useEffect, useContext, useCallback, } from 'react';
import styles from '../../style/modalstyle/ModalCreateDoctorSchedule.module.css';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import { createDoctorSchedule } from '../../http/doctorScheduleAPI';
import { daysUa, translateDays } from '../../constants/daysOfWeek';
import { Context } from '../../index';
import AlertPopup from '../../components/elements/AlertPopup';

const ModalCreateDoctorSchedule = ({ onClose, onSubmit }) => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scheduleTemplate, setScheduleTemplate] = useState({});
  const [alert, setAlert] = useState(null);

  const loadDoctors = useCallback(async () => {
    if (!hospitalId) return;
    try {
      const data = await fetchDoctorsByHospitalId(hospitalId);
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error('Помилка при завантаженні лікарів:', error);
    }
  }, [hospitalId]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchInput(input);

    const filtered = doctors.filter((doc) => {
      const fullName = `${doc.last_name} ${doc.first_name} ${doc.middle_name || ''}`.toLowerCase();
      return fullName.includes(input.toLowerCase());
    });

    setFilteredDoctors(filtered);
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc.id);
    setSearchInput(`${doc.last_name} ${doc.first_name} ${doc.middle_name || ''}`);
    setFilteredDoctors([]);
  };

  const handleTimeChange = (day, field, value) => {
    setScheduleTemplate(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const createPayload = () => {
    const translatedSchedule = Object.entries(scheduleTemplate).reduce((acc, [day, times]) => {
      const enDay = translateDays[day];
      if (enDay) acc[enDay] = times;
      return acc;
    }, {});

    return {
      doctor_id: Number(selectedDoctor),
      start_date: startDate,
      end_date: endDate,
      schedule_template: translatedSchedule,
    };
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !startDate || !endDate) {
      setAlert({ message: "Будь ласка, заповніть всі обов’язкові поля.", type: 'warning' });
      return;
    }

    try {
      await createDoctorSchedule(createPayload());
      setAlert({ message: 'Розклад успішно створений', type: 'success' });

      setTimeout(() => {
        onClose();
        onSubmit();
      }, 1500);
    } catch (error) {
      console.error('Помилка при створенні розкладу:', error);
      setAlert({ message: 'Не вдалося створити розклад.', type: 'error' });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {alert && <AlertPopup message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

        <header className={styles.header}>
          <h2 className={styles.title}>Створити розклад для лікаря</h2>
        </header>

        <div className={styles.selectGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="Введіть прізвище або ім’я лікаря"
            value={searchInput}
            onChange={handleSearchChange}
          />
          {filteredDoctors.length > 0 && (
            <ul className={styles.suggestions}>
              {filteredDoctors.map((doc) => (
                <li
                  key={doc.id}
                  className={styles.suggestionItem}
                  onClick={() => handleSelectDoctor(doc)}
                >
                  {doc.last_name} {doc.first_name} {doc.middle_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.dateRow}>
          <div className={styles.formGroup}>
            <label>Початок дії розкладу:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Кінець дії розкладу:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className={styles.scheduleTemplate}>
          <h3>Часи прийому</h3>
          <div className={styles.scheduleColumns}>
            <div className={styles.scheduleColumn}>
              {daysUa.slice(0, 4).map(day => (
                <div key={day} className={styles.dayRow}>
                  <label>{day}</label>
                  <input
                    type="time"
                    value={scheduleTemplate[day]?.start_time || ''}
                    onChange={e => handleTimeChange(day, 'start_time', e.target.value)}
                  />
                  <input
                    type="time"
                    value={scheduleTemplate[day]?.end_time || ''}
                    onChange={e => handleTimeChange(day, 'end_time', e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className={styles.scheduleColumn}>
              {daysUa.slice(4).map(day => (
                <div key={day} className={styles.dayRow}>
                  <label>{day}</label>
                  <input
                    type="time"
                    value={scheduleTemplate[day]?.start_time || ''}
                    onChange={e => handleTimeChange(day, 'start_time', e.target.value)}
                  />
                  <input
                    type="time"
                    value={scheduleTemplate[day]?.end_time || ''}
                    onChange={e => handleTimeChange(day, 'end_time', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button className={styles.cancelButton} onClick={onClose}>
            <span className={styles.closeIcon}>×</span>
            <span className={styles.closeText}>Скасувати</span>
          </button>
          <button className={styles.saveButton} onClick={handleSubmit}>
            <span className={styles.saveIcon}>✓</span>
            <span className={styles.saveText}>Зберегти</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateDoctorSchedule;
