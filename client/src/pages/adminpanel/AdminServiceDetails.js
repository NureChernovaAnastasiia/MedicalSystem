import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorDetailsAppointment.module.css';
import AlertPopup from '../../components/elements/AlertPopup';
import Loader from '../../components/elements/Loader';
import { formatAppointmentDate } from '../../utils/formatDate';
import { iconDoctor, iconPeople } from '../../utils/icons';
import { fetchLabTestById, deleteLabTest, fetchLabTestPdf} from '../../http/analysisAPI';
import { fetchMedicalServiceById, deleteMedicalService, fetchMedicalServicePdf } from '../../http/servicesAPI';

const AdminServiceDetails = () => {
  const navigate = useNavigate();
  const { serviceType, id } = useParams();
  const [data, setData] = useState(null);
  const [results, setResults] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);

  const isReady = data?.is_ready === true;

  const formattedDateTime = data ? formatAppointmentDate(data) : '';
  const serviceName =
    data?.MedicalServiceInfo?.name ||
    data?.LabTestSchedule?.HospitalLabService?.LabTestInfo?.name ||
    'Послуга';

  const doctor = data?.Doctor;
  const doctorName = doctor
    ? `${doctor.last_name || ''} ${doctor.first_name || ''} (${doctor.specialization || ''})`.trim()
    : 'Невідомий лікар';

  const patient = data?.Patient;
  const patientName = patient
    ? `${patient.last_name || ''} ${patient.first_name || ''} ${patient.middle_name || ''}`.trim()
    : 'Невідомий пацієнт';

  const translateStatus = (ready) => (ready ? 'Готово' : 'В роботі');

  const goBack = () => navigate(-1);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let fetched;
      if (serviceType === 'lab-test') {
        fetched = await fetchLabTestById(id);
      } else if (serviceType === 'medical-service') {
        fetched = await fetchMedicalServiceById(id);
      } else {
        throw new Error('Невідомий тип послуги');
      }

      setData(fetched);
      setResults(fetched.results || '');
      setNotes(fetched.notes || '');
    } catch (err) {
      console.error(err);
      setError('Не вдалося завантажити деталі послуги');
    } finally {
      setLoading(false);
    }
  }, [id, serviceType]);

  const handleDelete = async () => {
    try {
        if (!window.confirm('Ви дійсно хочете видалити цю послугу?')) return;

        if (serviceType === 'lab-test') {
        await deleteLabTest(id);
        } else if (serviceType === 'medical-service') {
        await deleteMedicalService(id);
        }

        setAlert({ message: 'Послугу успішно видалено', type: 'success' });
        setTimeout(() => navigate(-1), 1500); // Повернення назад через 1.5 секунди
    } catch (error) {
        console.error(error);
        setAlert({ message: 'Помилка при видаленні послуги', type: 'error' });
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!data) return null;

  const renderMultilineText = (text) =>
    (text || 'Відсутні дані').split('\n').map((line, i) => <p key={i}>{line}</p>);

  return (
    <div className={styles.container}>
      {alert && (
        <AlertPopup
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
      <h1 className={styles.title}>Деталі послуги: {serviceName}</h1>

      <div className={styles.analysisHeader}>
        <p className={styles.analysisDate}>
          Дата та час: {formattedDateTime} | Статус: {translateStatus(data.is_ready)}
        </p>

        <div className={styles.statusActions}>
          {!isReady && (
            <button
              className={styles.completeButton}
              onClick={handleDelete}
            >
              <span className={styles.closeIcon}>×</span>
              <span className={styles.closeText}>Видалити</span>
            </button>
          )}

        </div>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <img src={iconPeople} alt="People Icon" className={styles.icon} />
          <p className={styles.detailText}>
            <strong>Пацієнт:</strong> {patientName}
          </p>
        </div>
        <div className={styles.detailItem}>
          <img src={iconDoctor} alt="Doctor Icon" className={styles.icon} />
          <p className={styles.detailText}>
            <strong>Лікар:</strong> {doctorName}
           </p>
        </div>
      </div>

      <section>
        <h3 className={styles.resultsTitle}>Результати</h3>
          <div className={styles.resultsBlock}>
            <div className={styles.resultsText}>{renderMultilineText(results)}</div>
            <div className={styles.pdfWrapper}>
                <button
                    onClick={() => {
                    if (serviceType === 'lab-test') {
                        fetchLabTestPdf(id);
                    } else if (serviceType === 'medical-service') {
                        fetchMedicalServicePdf(id);
                    }
                    }}
                    className={styles.viewPdf}
                >
                    Переглянути PDF
                </button>
            </div>
          </div>
      </section>

      <section>
        <h3 className={styles.resultsTitle}>Коментар лікаря</h3>
          <div className={styles.commentBlock}>
            <div className={styles.commentText}>{renderMultilineText(notes)}</div>
          </div>
      </section>

      <div className={styles.footerActions}>
        <button onClick={goBack} className={styles.backButton}>
          ‹ Повернутися назад
        </button>
      </div>
    </div>
  );
};

export default AdminServiceDetails;
