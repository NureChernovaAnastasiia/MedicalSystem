import React, { useState, useEffect, useContext, useCallback } from 'react';
import { format } from 'date-fns';
import { Context } from '../../index';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import SearchInput from '../../components/options/SearchInput';
import SearchByDoctor from '../../components/options/SearchByDoctor';
import DateRangeFilter from '../../components/options/DateRangeFilter';
import AppointmentItem from '../../components/appointment/AppointmentItem';
import ModalCreateAppointment from '../../components/modals/ModalCreateAppointment';
import ModalAppointmentDetails from '../../components/modals/ModalAppointmentDetails';
import Loader from '../../components/elements/Loader';

import styles from '../../style/adminpanel/AdminAllAppointments.module.css';

import { fetchAppointmentsByHospital } from '../../http/appointmentAPI';

const AdminAllAppointments = () => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [appointments, setAppointments] = useState([]);
  const [dateRange, setDateRange] = useState([{ startDate: null, endDate: null, key: 'selection' }]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const loadAppointments = useCallback(async () => {
    if (!hospitalId) return;
    try {
      const data = await fetchAppointmentsByHospital(hospitalId);
      const formatted = data.map(app => formatAppointment(app)).sort((a, b) => b.date_time - a.date_time);
      setAppointments(formatted);
    } catch (err) {
      setError('Помилка при завантаженні прийомів');
    }
  }, [hospitalId]);

  useEffect(() => {
    if (!hospitalId) return;

    setLoading(true);
    setError(null);

    loadAppointments().finally(() => setLoading(false));
  }, [hospitalId, loadAppointments]);

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
    try {
      await loadAppointments();
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
    const doctorId = app.doctor_id;

    const matchByName = fullNameLower.includes(searchLower);
    const isInDateRange =
      (!startDate || appointmentDate >= startDate) &&
      (!endDate || appointmentDate <= endDate);
    const matchByDoctor = selectedDoctorId === '' || doctorId === +selectedDoctorId;

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

    return matchByName && isInDateRange && statusMatch && matchByDoctor;
  });
 
  const handleOpenDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
    setShowDetailsModal(false);
  };

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

        <SearchByDoctor
          hospitalId={hospitalId}
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
        />

        <DateRangeFilter
          dateRange={dateRange}
          setDateRange={setDateRange}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
        />
      </div>

      <div className={styles.tableHeader}>
        <span>Дата прийому</span>
        <span>Час прийому</span>
        <span>ПІБ лікаря</span>
        <span>ПІБ пацієнта</span>
        <span>Статус</span>
      </div>

      <div className={styles.cardsGrid}>
        {loading && <Loader />}
        {error && !loading && <p className={styles.error}>{error}</p>}
        {!loading && !error && filteredAppointments.length === 0 && (
          <p className={styles.noResults}>Прийомів не знайдено</p>
        )}
        {!loading && !error && filteredAppointments.length > 0 &&
          filteredAppointments.map(app => (
            <AppointmentItem key={app.id} appointment={app} onDetailsClick={handleOpenDetails}/>
          ))
        }
      </div>

      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <ModalCreateAppointment
              hospitalId={hospitalId}
              onClose={() => setShowCreateModal(false)}
              onCreate={handleCreateAppointment}
            />
          </div>
        </div>
      )}

      {showDetailsModal && selectedAppointment && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
            <ModalAppointmentDetails
                appointment={selectedAppointment}
                onClose={handleCloseDetails}
            />
            </div>
        </div>
       )}
    </div>
  );
};

export default AdminAllAppointments;
