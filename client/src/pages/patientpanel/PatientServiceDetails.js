import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientAnalyseDetail.module.css';

import { iconDoctor, iconHospital } from '../../utils/icons';
import { fetchMedicalServiceById, fetchMedicalServicePdf } from '../../http/servicesAPI'; 
import Loader from '../../components/elements/Loader';

const PatientServiceDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadService = async () => {
      try {
        const data = await fetchMedicalServiceById(id);
        setService(data);
      } catch (err) {
        setError('Не вдалося завантажити деталі послуги');
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  const renderMultilineText = (text) =>
    (text || 'Відсутні дані').split('\n').map((line, i) => <p key={i}>{line}</p>);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!service) return null;

  const serviceName = service.MedicalServiceInfo?.name || 'Невідома послуга';
  const serviceDate = service.MedicalServiceSchedule?.appointment_date
    ? new Date(service.MedicalServiceSchedule?.appointment_date).toLocaleDateString('uk-UA')
    : 'Дата не вказана';

  const doctorName = service.Doctor
    ? `${service.Doctor.last_name || ''} ${service.Doctor.first_name || ''} ${service.Doctor.middle_name || ''}`.trim()
    : 'Невідомий лікар';

  const hospitalName = service.MedicalServiceSchedule?.HospitalMedicalService?.Hospital?.name || 'Невідомий заклад';

  const resultsText = service.results || 'Результати відсутні';
  const doctorComment = service.notes || 'Коментар відсутній';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Деталі послуги</h1>

      <div className={styles.analysisHeader}>
        <h2 className={styles.analysisTitle}>{serviceName}</h2>
        <p className={styles.analysisDate}>Дата проведення: {serviceDate}</p>
      </div>

      <div className={styles.detailsSection}>
        <div className={styles.detailItem}>
          <img src={iconDoctor} alt="Doctor Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Відповідаючий лікар:</strong> {doctorName}</p>
        </div>
        <div className={styles.detailItem}>
          <img src={iconHospital} alt="Hospital Icon" className={styles.icon} />
          <p className={styles.detailText}><strong>Місце проведення:</strong> {hospitalName}</p>
        </div>
      </div>

      <h3 className={styles.resultsTitle}>Результати</h3>
      <div className={styles.resultsBlock}>
        <p className={styles.resultsText}>{renderMultilineText(resultsText)}</p>
          <div className={styles.pdfWrapper}>
            <button onClick={() => fetchMedicalServicePdf(service.id)} className={styles.viewPdf}>
              Переглянути PDF
            </button>
          </div>
      </div>

      <h3 className={styles.commentTitle}>Коментар лікаря</h3>
      <div className={styles.commentBlock}>
        <p className={styles.commentText}>{renderMultilineText(doctorComment)}</p>
      </div>

      <div className={styles.backLink}>
        <button onClick={goBack} className={styles.backButton}>
          ‹ Повернутися назад до списку послуг
        </button>
      </div>
    </div>
  );
};

export default PatientServiceDetails;
