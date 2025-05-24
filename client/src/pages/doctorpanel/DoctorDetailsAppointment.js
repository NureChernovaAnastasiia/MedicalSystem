import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorDetailsAppointment.module.css';
import DiagnosisCard from '../../components/medcard/DiagnosisCard';
import { formatAppointmentDate } from '../../utils/formatDate';
import { iconDoctor, iconHospital } from '../../utils/icons';
import { fetchAppointmentById, completeAppointment, cancelAppointment, updateAppointment } from '../../http/appointmentAPI'; // додано updateAppointment
import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';

const DoctorDetailsAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAppointmentById(id);
        setAppointment(data);
        setNotes(data.notes || '');

        const patientId = data.Patient?.id;
        if (patientId) {
          const allRecords = await fetchMedicalRecordsByPatientId(patientId);
          const appointmentDate = new Date(data.appointment_date);
          const filtered = allRecords.filter((record) => {
            const recordDate = new Date(record.record_date);
            return recordDate.toDateString() === appointmentDate.toDateString();
          });
          setDiagnoses(filtered);
        }
      } catch (err) {
        console.error(err);
        setError('Не вдалося завантажити деталі прийому');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleComplete = async () => {
    try {
      await completeAppointment(appointment.id, notes);
      const updated = await fetchAppointmentById(id);
      setAppointment(updated);
      setNotes(updated.notes || '');
    } catch (error) {
      console.error(error);
      alert('Помилка завершення прийому');
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(appointment.id, notes);
      const updated = await fetchAppointmentById(id);
      setAppointment(updated);
      setNotes(updated.notes || '');
    } catch (error) {
      console.error(error);
      alert('Помилка скасування прийому');
    }
  };

const handleSaveNotes = async () => {
  try {
    await updateAppointment(appointment.id, { notes }); 
    const updated = await fetchAppointmentById(appointment.id); 
    setAppointment(updated);
    setNotes(updated.notes || '');
    alert('Коментар успішно збережено');
  } catch (error) {
    console.error('Помилка збереження:', error.response?.data || error.message || error);
    alert('Помилка збереження коментаря: ' + (error.response?.data?.message || error.message || 'невідома помилка'));
  }
};

  if (loading) return <p className={styles.loading}>Завантаження...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!appointment) return null;

  const translateStatus = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'Заплановано';
      case 'Completed':
        return 'Завершено';
      case 'Cancelled':
        return 'Скасовано';
      default:
        return 'Невідомо';
    }
  };

  const isEditable = appointment.status === 'Scheduled';
  const formattedDateTime = formatAppointmentDate(appointment);
  const doctor = appointment.Doctor;
  const patient = appointment.Patient;
  const hospital = doctor?.Hospital;

  const hospitalName = hospital?.name || 'Невідомий заклад';
  const patientName = patient
    ? `${patient.last_name} ${patient.first_name} ${patient.middle_name}`.trim()
    : 'Невідомий пацієнт';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Деталі прийому</h1>

      <div className={styles.analysisHeader}>
        <p className={styles.analysisDate}>
          Дата та час прийому: {formattedDateTime} | Статус: {translateStatus(appointment.status)}
        </p>

        {isEditable && (
          <div className={styles.statusActions}>
            <button className={styles.completeButton} onClick={handleComplete}>
              <span className={styles.completeIcon}>✓</span>
              <span className={styles.completeText}>Завершити прийом</span>
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Скасувати</span>
            </button>
          </div>
        )}
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <img src={iconDoctor} alt="Doctor Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Пацієнт:</strong> {patientName}</p>
        </div>
        <div className={styles.detailItem}>
          <img src={iconHospital} alt="Hospital Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Місце проведення:</strong> {hospitalName}</p>
        </div>
      </div>

      <h3 className={styles.resultsTitle}>Коментар до прийому</h3>
      <div>
        {isEditable ? (
            <textarea
              className={styles.commentTextarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Введіть коментар до прийому"
            />
        ) : (
          <div className={styles.resultsBlock}>
            <p className={styles.resultsText}>{notes || 'Коментар відсутній'}</p>
          </div>
        )}
      </div>

      <div className={styles.diagnosisHeader}>
        <h3 className={styles.commentTitle}>Встановлені діагнози</h3>
        <button className={styles.addButton}>+ Додати</button>
      </div>

      <div className={styles.cardsGrid}>
        {diagnoses.length > 0 ? (
          diagnoses.map(({ id, diagnosis, record_date }) => (
            <DiagnosisCard key={id} id={id} diagnosis={diagnosis} record_date={record_date} />
          ))
        ) : (
          <p className={styles.noResults}>Діагнози не знайдені</p>
        )}
      </div>

      <div className={styles.footerActions}>
        <button onClick={goBack} className={styles.backButton}>
          ‹ Повернутися назад
        </button>
       
        {isEditable && (
          <button onClick={handleSaveNotes} className={styles.saveButton}>
            Зберегти
          </button>
        )} 
      </div>
    </div>
  );
};

export default DoctorDetailsAppointment;
