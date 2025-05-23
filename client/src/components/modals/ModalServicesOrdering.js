import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../../style/modalstyle/ModalServicesOrdering.module.css';
import {
  iconAddress,
  iconHospital,
  iconSyringe,
  iconMoney,
} from '../../utils/icons';
import {
  getAvailableLabTestTimes,
  bookLabTestScheduleById,
} from '../../http/analysisScheduleAPI.js';
import {
  getAvailableMedicalServiceTimes,
  bookMedicalServiceScheduleById,
} from '../../http/servicesScheduleAPI.js';
import AlertPopup from '../../components/elements/AlertPopup';
import {
  createPaypalOrder,
  capturePaypalOrder,
} from '../../http/paypalAPI';

import { loadPaypalScript, renderPaypalButtons } from '../../services/paypalServices';

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

const ModalServicesOrdering = ({ onClose, analyse, hospital }) => {
  const [dateOptions, setDateOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);

  const paypalRef = useRef(null);

  const isLabTest = !!analyse?.LabTestInfo;
  const itemId = analyse?.id;
  const analysisName = analyse?.LabTestInfo?.name || analyse?.MedicalServiceInfo?.name || '—';
  const price = analyse?.LabTestInfo?.price || analyse?.MedicalServiceInfo?.price || '—';
  const labName = analyse?.Hospital?.name || hospital?.name || '—';
  const labAddress = analyse?.Hospital?.address || hospital?.address || '—';

  const fetchAvailableDates = useCallback(async () => {
    if (!itemId) return;

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
          const times = isLabTest
            ? await getAvailableLabTestTimes(itemId, isoDate)
            : await getAvailableMedicalServiceTimes(itemId, isoDate);

          const available = times.filter((t) => !t.is_booked);
          if (!available.length) return null;
          return { value: isoDate, label: formatDateDisplay(date), times: available };
        })
      );
      setDateOptions(results.filter(Boolean));
    } catch {
      setAlert({ message: 'Помилка при завантаженні доступних дат.', type: 'error' });
    }
  }, [itemId, isLabTest]);

  useEffect(() => {
    fetchAvailableDates();
  }, [fetchAvailableDates]);

  useEffect(() => {
    const selected = dateOptions.find((d) => d.value === selectedDate);
    setAvailableTimes(selected?.times || []);
    setSelectedTime('');
  }, [selectedDate, dateOptions]);

  useEffect(() => {
    loadPaypalScript()
      .then(() => setPaypalReady(true))
      .catch(() => setAlert({ message: 'Помилка завантаження PayPal.', type: 'error' }));
  }, []);

  useEffect(() => {
    if (
      paypalReady &&
      paypalRef.current &&
      selectedDate &&
      selectedTime &&
      price &&
      availableTimes.length
    ) {
      renderPaypalButtons({
        container: paypalRef.current,
        createOrder: async () => {
          if (!selectedDate || !selectedTime) {
            setAlert({ message: 'Будь ласка, оберіть дату і час', type: 'error' });
            return;
          }
          setIsLoading(true);
          try {
            const order = await createPaypalOrder(isLabTest ? 'lab' : 'service', parseInt(price));
            return order.id;
          } catch {
            setAlert({ message: 'Не вдалося створити PayPal-замовлення.', type: 'error' });
            setIsLoading(false);
          }
        },
        onApprove: async (data) => {
          try {
            const captureResult = await capturePaypalOrder(
              data.orderID,
              isLabTest ? 'lab' : 'service',
              hospital?.id || analyse?.Hospital?.id
            );

            if (captureResult.status === 'COMPLETED') {
              const schedule = availableTimes.find((t) => t.start_time === selectedTime);

              if (!schedule) {
                setAlert({ message: 'Вибраний час недоступний', type: 'error' });
                return;
              }

              try {
                if (isLabTest) {
                  await bookLabTestScheduleById(schedule.id, data.orderID);
                } else {
                  await bookMedicalServiceScheduleById(schedule.id, data.orderID);
                }
              } catch {
                setAlert({ message: 'Помилка під час запису.', type: 'error' });
                return;
              }

              setAlert({ message: 'Запис успішно створено', type: 'success' });
              setTimeout(() => {
                setAlert(null);
                onClose();
              }, 1200);
            } else {
              setAlert({ message: 'Помилка підтвердження оплати.', type: 'error' });
            }
          } catch {
            setAlert({ message: 'Помилка при підтвердженні оплати.', type: 'error' });
          } finally {
            setIsLoading(false);
          }
        },
        onError: () => {
          setAlert({ message: 'Помилка PayPal оплати.', type: 'error' });
          setIsLoading(false);
        },
        onCancel: () => {
          setAlert({ message: 'Оплата скасована.', type: 'error' });
          setIsLoading(false);
        },
      });
    }
  }, [paypalReady, selectedDate, selectedTime, price, availableTimes, isLabTest, hospital, analyse, onClose]);

  return (
    <>
      {alert && <AlertPopup message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.headerBackground}>
            <p className={styles.analysisInfo}>
              {isLabTest ? 'Інформація про аналіз' : 'Інформація про послугу'}
            </p>
            <InfoRow icon={iconSyringe} label={isLabTest ? 'Аналіз' : 'Послуга'} value={analysisName} />
            <InfoRow icon={iconHospital} label="Лікарня" value={labName} />
            <InfoRow icon={iconAddress} label="Адреса" value={labAddress} />
            <InfoRow icon={iconMoney} label="Ціна" value={`${parseInt(price)} грн`} />
          </div>

          <p className={styles.orderTitle}>{isLabTest ? 'Замовлення аналізу' : 'Замовлення послуги'}</p>
          <p className={styles.dateInstruction}>Будь ласка, оберіть дату та час.</p>

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
              disabled={!selectedDate || isLoading}
            >
              <option value="">Оберіть час</option>
              {availableTimes.map((t) => (
                <option key={t.start_time} value={t.start_time}>
                  {formatTimeDisplay(t.start_time)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.actionButtons}>       
            <div className={styles.paypalContainer} ref={paypalRef}></div> 
            <button className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
          </div> 
        </div> 
      </div> 
    </> 
);};

export default ModalServicesOrdering;
