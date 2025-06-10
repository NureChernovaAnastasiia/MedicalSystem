import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorDetailsAppointment.module.css';
import DiagnosisCard from '../../components/medcard/DiagnosisCard';
import ModalMedRecordCreation from '../../components/modals/ModalMedRecordCreation';
import AlertPopup from "../../components/elements/AlertPopup";
import Loader from '../../components/elements/Loader'; 
import { formatAppointmentDate } from '../../utils/formatDate';
import { iconDoctor, iconHospital } from '../../utils/icons';
import { fetchAppointmentById, completeAppointment, cancelAppointment, updateAppointment } from '../../http/appointmentAPI';
import { fetchMedicalRecordsByPatientId } from '../../http/medicalRecordAPI';

const DoctorDetailsAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);

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
      await updateAppointment(appointment.id, { notes });
      
      await completeAppointment(appointment.id);

      const updated = await fetchAppointmentById(id);
      setAppointment(updated);
      setNotes(updated.notes || '');
      setAlert({ message: 'Прийом завершено успішно', type: 'success' });
    } catch (error) {
      console.error(error);
      setAlert({ message: 'Помилка завершення прийому', type: 'error' });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelAppointment(appointment.id, notes);
      const updated = await fetchAppointmentById(id);
      setAppointment(updated);
      setNotes(updated.notes || '');
      setAlert({ message: 'Запис успішно скасовано', type: 'success' });
    } catch (error) {
      console.error(error);
      setAlert({ message: 'Помилка скасування прийому', type: 'error' });
    }
  };

const handleSaveNotes = async () => {
  try {
    await updateAppointment(appointment.id, { notes }); 
    const updated = await fetchAppointmentById(appointment.id); 
    setAppointment(updated);
    setNotes(updated.notes || '');
    setIsEditing(false); 
    setAlert({ message: 'Коментар успішно збережено', type: 'success' });
  } catch (error) {
    console.error('Помилка збереження:', error.response?.data || error.message || error);
    setAlert({
      message: 'Помилка збереження коментаря: ' +
        (error.response?.data?.message || error.message || 'невідома помилка'),
      type: 'error',
    });
  }
};

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCreateRecord = async () => {
    if (appointment?.Patient?.id) {
      try {
        const updatedRecords = await fetchMedicalRecordsByPatientId(appointment.Patient.id);
        const appointmentDate = new Date(appointment.appointment_date);
        const filtered = updatedRecords.filter((record) => {
          const recordDate = new Date(record.record_date);
          return recordDate.toDateString() === appointmentDate.toDateString();
        });
        setDiagnoses(filtered);
        setShowModal(false);
      } catch (error) {
        console.error('Помилка оновлення діагнозів:', error);
      }
    }
  };

  if (loading) return <Loader />;
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

  const renderMultilineText = (text) =>
    (text || 'Відсутні дані').split('\n').map((line, i) => <p key={i}>{line}</p>);

  const isEditable = appointment.status === 'Scheduled';
  const formattedDateTime = formatAppointmentDate(appointment);
  const doctor = appointment.Doctor;
  const patient = appointment.Patient;
  const hospital = doctor?.Hospital;

  const hospitalName = hospital?.name || 'Невідомий заклад';
  const patientName = patient
    ? `${patient.last_name || ''} ${patient.first_name || ''} ${patient.middle_name || ''}`.trim()
    : 'Невідомий пацієнт';

  return (
    <div className={styles.container}>
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
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
        {(isEditable || isEditing) ? (
            <textarea
              className={styles.commentTextarea}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Введіть коментар до прийому"
            />
        ) : (
          <div className={styles.resultsBlock}>
            <div className={styles.resultsText}>{renderMultilineText(notes)}</div>
          </div>
        )}
      </div>

      <div className={styles.diagnosisHeader}>
        <h3 className={styles.commentTitle}>Встановлені діагнози</h3>
        {(appointment.status !== 'Completed' || isEditing) && (
          <button className={styles.addButton} onClick={handleOpenModal}>+ Додати</button>
        )}
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
       
        {(isEditing && !isEditable) && (
          <button
            onClick={handleSaveNotes}
            className={styles.saveButton}
          >
            Зберегти
          </button>
        )}

        {!isEditable && appointment.status === 'Completed' && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={styles.saveButton}
          >
            Внести дані
          </button>
        )}

        {showModal && (
          <ModalMedRecordCreation
            patientId={appointment.Patient.id}
            doctorId={appointment.Doctor.id}
            onClose={handleCloseModal}
            onCreate={handleCreateRecord}
          />
        )}
      </div>
    </div>
  );
};

export default DoctorDetailsAppointment;
