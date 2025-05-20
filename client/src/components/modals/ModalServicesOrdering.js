import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../style/modalstyle/ModalServicesOrdering.module.css';
import {
  iconAddress,
  iconHospital,
  iconSyringe,
  iconMoney,
} from '../../utils/icons';
import { getAvailableLabTestTimes, bookLabTestScheduleById } from '../../http/analysisScheduleAPI.js';
import AlertPopup from '../../components/elements/AlertPopup';

const InfoRow = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <img src={icon} alt={label} className={styles.infoIcon} />
    <p className={styles.infoText}>
      <strong>{label}:</strong> {value}
    </p>
  </div>
);

const formatDateISO = (date) => date.toISOString().split('T')[0];
const formatDateDisplay = (date) => date.toLocaleDateString('uk-UA');
const formatTimeDisplay = (isoTime) =>
  new Date(isoTime).toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const ModalServicesOrdering = ({ onClose, analyse }) => {
  const [dateOptions, setDateOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const labServiceId = analyse?.id;

  const fetchAvailableDates = useCallback(async () => {
    if (!labServiceId) return;

    const today = new Date();
    const datesToCheck = Array.from({ length: 10 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });

    try {
      const results = await Promise.all(
        datesToCheck.map(async (date) => {
          const isoDate = formatDateISO(date);
          const times = await getAvailableLabTestTimes(labServiceId, isoDate);
          const available = times.filter((t) => !t.is_booked);
          if (!available.length) return null;
          return { value: isoDate, label: formatDateDisplay(date), times: available };
        })
      );
      setDateOptions(results.filter(Boolean));
    } catch (error) {
      console.error('Помилка при завантаженні доступних дат:', error);
    }
  }, [labServiceId]);

  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates]);

  useEffect(() => {
    const selected = dateOptions.find((d) => d.value === selectedDate);
    setAvailableTimes(selected?.times || []);
    setSelectedTime('');
  }, [selectedDate, dateOptions]);

  const handlePayment = async () => {
    if (!selectedDate || !selectedTime) {
      setAlert({ message: 'Будь ласка, оберіть дату і час', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      const schedule = availableTimes.find((t) => t.start_time === selectedTime);
      if (!schedule) {
        setAlert({ message: 'Вибраний час недоступний', type: 'error' });
        return;
      }

      await bookLabTestScheduleById(schedule.id);

      setAlert({ message: 'Запис на аналіз успішно створено', type: 'success' });
      setTimeout(() => {
        setAlert(null);
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
      setAlert({ message: 'Помилка при бронюванні. Спробуйте пізніше.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const analysisName = analyse?.LabTestInfo?.name || analyse?.MedicalServiceInfo?.name || '—';
  const price = analyse?.LabTestInfo?.price || analyse?.MedicalServiceInfo?.price || '—';
  const labName = analyse?.Hospital?.name || '—';
  const labAddress = analyse?.Hospital?.address || '—';

  return (
    <>
      {alert && (
        <AlertPopup message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.headerBackground}>
            <p className={styles.analysisInfo}>Інформація про аналіз</p>
            <InfoRow icon={iconSyringe} label="Аналіз" value={analysisName} />
            <InfoRow icon={iconHospital} label="Лабораторія" value={labName} />
            <InfoRow icon={iconAddress} label="Адреса" value={labAddress} />
            <InfoRow icon={iconMoney} label="Ціна" value={`${parseInt(price)} грн`} />
          </div>

          <p className={styles.orderTitle}>Замовлення аналізу</p>
          <p className={styles.dateInstruction}>Будь ласка, оберіть дату проходження аналізу.</p>

          <div className={styles.dateSelectWrapper}>
            <select
              className={styles.dateSelector}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Оберіть дату</option>
              {dateOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              className={styles.dateSelector}
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={!availableTimes.length || isLoading}
            >
              <option value="">Оберіть час</option>
              {availableTimes.map(({ start_time, end_time }, idx) => (
                <option key={idx} value={start_time}>
                  {formatTimeDisplay(start_time)} - {formatTimeDisplay(end_time)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.actionButtons}>
            <div
              className={`${styles.payButton} ${isLoading ? styles.disabledButton : ''}`}
              onClick={isLoading ? undefined : handlePayment}
            >
              {isLoading ? 'Зачекайте...' : 'Оплатити'}
            </div>
            <button className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalServicesOrdering;
