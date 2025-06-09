import React, { useState } from 'react';
import styles from '../../style/modalstyle/ModalCreateDoctorSchedule.module.css';
import { createMedicalServiceSchedule } from '../../http/servicesScheduleAPI'; 
import { createLabTestSchedule } from '../../http/analysisScheduleAPI';
import { daysUa, translateDays } from '../../constants/daysOfWeek';
import AlertPopup from '../../components/elements/AlertPopup';

const ModalCreateServiceSchedule = ({ id, type, onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scheduleTemplate, setScheduleTemplate] = useState({});
  const [alert, setAlert] = useState(null);

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

    let payload = {
      start_date: startDate,
      end_date: endDate,
      time_template: translatedSchedule,
    };

    if (type === 'service') {
      payload.hospital_medical_service_id = id;
    } else if (type === 'analysis') {
      payload.hospital_lab_service_id = id;
    }

    return payload;
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      setAlert({ message: "Будь ласка, заповніть всі обов’язкові поля.", type: 'warning' });
      return;
    }

    try {
      const payload = createPayload();
      if (type === 'service') {
        await createMedicalServiceSchedule(payload);
      } else if (type === 'analysis') {
        await createLabTestSchedule(payload);
      } else {
        throw new Error('Невідомий тип розкладу');
      }

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
          <h2 className={styles.title}>
            Створити розклад для {type === 'service' ? 'медичної послуги' : 'лабораторного тесту'}
          </h2>
        </header>

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

export default ModalCreateServiceSchedule;
