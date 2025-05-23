import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { Context } from '../../index';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import SearchInput from '../../components/options/SearchInput';
import DateRangeFilter from '../../components/options/DateRangeFilter';
import AppointmentItem from '../../components/appointment/AppointmentItem';

import styles from '../../style/doctorpanel/DoctorAllAppointments.module.css';

import { fetchDoctorByUserId } from '../../http/doctorAPI';
import { fetchAllDoctorAppointments } from '../../http/appointmentAPI';

const DoctorAllAppointments = () => {
  const { user } = useContext(Context);

  const [appointments, setAppointments] = useState([]);
  const [dateRange, setDateRange] = useState([
    { startDate: null, endDate: null, key: 'selection' },
  ]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.user?.id) return;

    const getDoctorAndAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const doctor = await fetchDoctorByUserId(user.user.id);
        const data = await fetchAllDoctorAppointments(doctor.id);

        const formatted = data.map(app => {
          const dateStr = app.appointment_date;
          const timeStr = app.DoctorSchedule?.start_time || '00:00:00';
          const dateTime = new Date(`${dateStr}T${timeStr}`);

          return {
            ...app,
            date_time: dateTime,
            formattedDate: format(dateTime, 'dd.MM.yyyy HH:mm'),
            patientFullName: `${app.Patient.last_name} ${app.Patient.first_name} ${app.Patient.middle_name || ''}`.trim(),
            status: app.status.toLowerCase(),
          };
        }).sort((a, b) => b.date_time - a.date_time);

        setAppointments(formatted);
      } catch (error) {
        setError('Помилка при завантаженні прийомів');
      } finally {
        setLoading(false);
      }
    };

    getDoctorAndAppointments();
  }, [user?.user?.id]);

  const { startDate, endDate } = dateRange[0];

  const filteredAppointments = appointments.filter(app => {
    const fullNameLower = app.patientFullName.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const appointmentDate = new Date(app.date_time);
    const status = app.computed_status?.toLowerCase();

    const matchByName = fullNameLower.includes(searchLower);
    const isInDateRange =
      (!startDate || appointmentDate >= startDate) &&
      (!endDate || appointmentDate <= endDate);

    let statusMatch = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'upcoming') {
        statusMatch = status === 'upcoming' || status === 'scheduled';
      } else if (statusFilter === 'past') {
        statusMatch = status === 'past';
      } else if (statusFilter === 'canceled') {
        statusMatch = status === 'cancelled';
      }
    }

    return matchByName && isInDateRange && statusMatch;
  });

  const getDateRangeLabel = () => {
    if (!startDate && !endDate) return 'Виберіть діапазон';
    if (startDate && !endDate) return `Від ${format(startDate, 'dd.MM.yyyy')}`;
    if (!startDate && endDate) return `До ${format(endDate, 'dd.MM.yyyy')}`;
    return `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`;
  };

  const resetDateFilter = () => {
    setDateRange([{ startDate: null, endDate: null, key: 'selection' }]);
    setShowCalendar(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Прийоми</h1>
        <div className={styles.orderButtonWrapper}>
          <button className={styles.orderButton}>Створити прийом</button>
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
        <div className={styles.datePickerWrapper}>
          <button
            onClick={() => setShowCalendar(prev => !prev)}
            className={styles.dateButton}
          >
            {getDateRangeLabel()}
          </button>

          {showCalendar && (
            <div className={styles.dateRangeWrapper}>
              <DateRangeFilter
                dateRange={dateRange}
                setDateRange={setDateRange}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
              />
              <button onClick={resetDateFilter} className={styles.clearDateButton}>
                Скинути фільтр
              </button>
            </div>
          )}
        </div>

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
        {loading && <p className={styles.loading}>Завантаження...</p>}
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
    </div>
  );
};

export default DoctorAllAppointments;
