import React, { useState, useEffect, useContext, useCallback } from 'react';
import { format } from 'date-fns';
import { Context } from '../../index';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import SearchInput from '../../components/options/SearchInput';
import DateRangeFilter from '../../components/options/DateRangeFilter';
import AppointmentItem from '../../components/appointment/AppointmentItem';
import ModalCreateAppointment from '../../components/modals/ModalCreateAppointment';
import Loader from '../../components/elements/Loader'; 

import styles from '../../style/doctorpanel/DoctorAllAppointments.module.css';

import { fetchDoctorByUserId } from '../../http/doctorAPI';
import { fetchAllDoctorAppointments } from '../../http/appointmentAPI';

const DoctorAllAppointments = () => {
  const { user } = useContext(Context);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadAppointments = useCallback(async (doctorId) => {
    const data = await fetchAllDoctorAppointments(doctorId);
    const formatted = data.map(app => formatAppointment(app)).sort((a, b) => b.date_time - a.date_time);
    setAppointments(formatted);
  }, []); 

  useEffect(() => {
    if (!user?.user?.id) return;

    const getDoctorAndAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const doctorData = await fetchDoctorByUserId(user.user.id);
        setDoctor(doctorData);
        await loadAppointments(doctorData.id);
      } catch (error) {
        setError('Помилка при завантаженні прийомів');
      } finally {
        setLoading(false);
      }
    };

    getDoctorAndAppointments();
  }, [user?.user?.id, loadAppointments]);

  const formatAppointment = (app) => {
    const dateStr = app.appointment_date;
    const timeStr = app.DoctorSchedule?.start_time || '00:00:00';
    const dateTime = new Date(`${dateStr}T${timeStr}`);

    const patient = app.Patient;
    const patientFullName = patient
      ? `${patient.last_name} ${patient.first_name} ${patient.middle_name || ''}`.trim()
      : 'Невідомий пацієнт';

    return {
      ...app,
      date_time: dateTime,
      formattedDate: format(dateTime, 'dd.MM.yyyy HH:mm'),
      patientFullName,
      status: app.status?.toLowerCase() || 'невідомо',
    };
  };

  const handleCreateAppointment = async () => {
    if (!doctor?.id) return;
    try {
      await loadAppointments(doctor.id);
    } catch (err) {
      console.error('Помилка при оновленні прийомів:', err);
    } finally {
      setShowCreateModal(false);
    }
  };

  const { startDate, endDate } = dateRange[0];

  const filteredAppointments = appointments.filter(app => {
    const fullNameLower = app.patientFullName.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const appointmentDate = new Date(app.date_time);
    const status = app.status;

    const matchByName = fullNameLower.includes(searchLower);
    const isInDateRange =
      (!startDate || appointmentDate >= startDate) &&
      (!endDate || appointmentDate <= endDate);

    let statusMatch = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'upcoming') {
        statusMatch = status === 'scheduled';
      } else if (statusFilter === 'past') {
        statusMatch = status === 'completed';
      } else if (statusFilter === 'canceled') {
        statusMatch = status === 'cancelled';
      }
    }

    return matchByName && isInDateRange && statusMatch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Прийоми</h1>
        <div className={styles.orderButtonWrapper}>
          <button
            className={styles.orderButton}
            onClick={() => setShowCreateModal(true)}
          >
            Створити прийом
          </button>
        </div>
      </div>

      <div className={styles.fullWidthSearch}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Введіть ПІБ пацієнта"
        />
      </div>

      <div className={styles.filterRow}>
        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />    

        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Усі прийоми</option>
          <option value="upcoming">Майбутні</option>
          <option value="past">Минулі</option>
          <option value="canceled">Скасовані</option>
        </select>
      </div>

      <div className={styles.tableHeader}>
        <span>Дата прийому</span>
        <span>Час прийому</span>
        <span>ПІБ пацієнта</span>
        <span>Статус</span>
      </div>

      <div className={styles.cardsGrid}>
        {loading && <Loader/>}
        {error && !loading && <p className={styles.error}>{error}</p>}
        {!loading && !error && filteredAppointments.length === 0 && (
          <p className={styles.noResults}>Прийомів не знайдено</p>
        )}
        {!loading && !error && filteredAppointments.length > 0 &&
          filteredAppointments.map(app => (
            <AppointmentItem key={app.id} appointment={app} />
          ))
        }
      </div>

      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ModalCreateAppointment doctorId={doctor?.id} onClose={() => setShowCreateModal(false)} onCreate={handleCreateAppointment} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAllAppointments;
