import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/doctorpanel/DoctorDetailsAppointment.module.css';
import AlertPopup from '../../components/elements/AlertPopup';
import Loader from '../../components/elements/Loader';
import { formatAppointmentDate } from '../../utils/formatDate';
import { iconDoctor, iconHospital } from '../../utils/icons';
import { fetchLabTestById, updateLabTest, markLabTestReady, fetchLabTestPdf } from '../../http/analysisAPI';
import { fetchMedicalServiceById, updateMedicalService, markMedicalServiceReady, fetchMedicalServicePdf } from '../../http/servicesAPI';

const DoctorServicesResults = () => {
  const navigate = useNavigate();
  const { serviceType, id } = useParams();
  const [data, setData] = useState(null);
  const [results, setResults] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState(null);

  const isReady = data?.is_ready === true;

  const isEditable = !isReady || isEditing;

  const formattedDateTime = data ? formatAppointmentDate(data) : '';
  const serviceName =
    data?.MedicalServiceInfo?.name ||
    data?.LabTestSchedule?.HospitalLabService?.LabTestInfo?.name ||
    'Послуга';

  const hospitalName =
    data?.MedicalServiceSchedule?.HospitalMedicalService?.Hospital?.name ||
    data?.Doctor?.Hospital?.name ||
    'Невідомий заклад';

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
      setIsEditing(false); 
    } catch (err) {
      console.error(err);
      setError('Не вдалося завантажити деталі послуги');
    } finally {
      setLoading(false);
    }
  }, [id, serviceType]);

  const handleComplete = async () => {
    try {
      const payload = { results, notes };

      if (serviceType === 'lab-test') {
        await updateLabTest(id, payload);
        await markLabTestReady(id);
      } else if (serviceType === 'medical-service') {
        await updateMedicalService(id, payload);
        await markMedicalServiceReady(id);
      }

      setAlert({ message: 'Дані збережені та позначені як готові', type: 'success' });
      await loadData();
      setIsEditing(false); 
    } catch (error) {
      console.error(error);
      setAlert({ message: 'Помилка при збереженні та позначенні готовності', type: 'error' });
    }
  };

  const handleSaveNotes = async () => {
    try {
      const payload = { results, notes };

      if (serviceType === 'lab-test') {
        await updateLabTest(id, payload);
      } else if (serviceType === 'medical-service') {
        await updateMedicalService(id, payload);
      }

      setAlert({ message: 'Дані успішно збережені', type: 'success' });
      await loadData();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setAlert({
        message:
          'Помилка збереження: ' +
          (error.response?.data?.message || error.message || 'невідома помилка'),
        type: 'error',
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
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
              onClick={handleComplete}
              disabled={!results.trim()}
            >
              <span className={styles.completeIcon}>✓</span>
              <span className={styles.completeText}>Позначити готовим</span>
            </button>
          )}

        </div>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <img src={iconDoctor} alt="Doctor Icon" className={styles.icon} />
          <p className={styles.detailText}>
            <strong>Пацієнт:</strong> {patientName}
          </p>
        </div>
        <div className={styles.detailItem}>
          <img src={iconHospital} alt="Hospital Icon" className={styles.icon} />
          <p className={styles.detailText}>
            <strong>Місце проведення:</strong> {hospitalName}
          </p>
        </div>
      </div>

      <section>
        <h3 className={styles.resultsTitle}>Результати</h3>
        {isEditable ? (
          <textarea
            className={styles.commentTextarea}
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="Введіть результати"
          />
        ) : (
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
        )}
      </section>

      <section>
        <h3 className={styles.resultsTitle}>Коментар лікаря</h3>
        {isEditable ? (
          <textarea
            className={styles.commentTextarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Введіть коментар"
          />
        ) : (
          <div className={styles.commentBlock}>
            <div className={styles.commentText}>{renderMultilineText(notes)}</div>
          </div>
        )}
      </section>

      <div className={styles.footerActions}>
        <button onClick={goBack} className={styles.backButton}>
          ‹ Повернутися назад
        </button>

        {(isEditing) && results.trim() && (
          <button onClick={handleSaveNotes} className={styles.saveButton}>
            Зберегти
          </button>
        )}
        
        {isReady && !isEditing && (
          <button className={styles.saveButton} onClick={handleEdit}>
            Внести зміни
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorServicesResults;
