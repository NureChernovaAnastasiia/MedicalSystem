import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientAnalyseDetail.module.css';

import { iconDoctor, iconHospital } from '../../utils/icons';
import { fetchLabTestById, fetchLabTestPdf } from '../../http/analysisAPI';
import Loader from '../../components/elements/Loader';

const PatientAnalyseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [labTest, setLabTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const loadLabTest = async () => {
      try {
        const data = await fetchLabTestById(id);
        setLabTest(data);
      } catch (err) {
        setError('Не вдалося завантажити деталі аналізу');
      } finally {
        setLoading(false);
      }
    };

    loadLabTest();
  }, [id]);

  const renderMultilineText = (text) =>
    (text || 'Відсутні дані').split('\n').map((line, i) => <p key={i}>{line}</p>);

  if (loading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!labTest) return null;

  const testName = labTest.LabTestSchedule?.HospitalLabService?.LabTestInfo?.name || 'Невідомий аналіз';
  const testDate = labTest.LabTestSchedule?.appointment_date
    ? new Date(labTest.LabTestSchedule.appointment_date).toLocaleDateString('uk-UA')
    : 'Дата не вказана';

  const doctorName = labTest.Doctor
    ? `${labTest.Doctor.last_name || ''} ${labTest.Doctor.first_name || ''} ${labTest.Doctor.middle_name || ''}`.trim()
    : 'Невідомий лікар';
  const hospitalName = labTest.Doctor?.Hospital?.name || 'Невідомий заклад';
  const resultsText = labTest.results || 'Результат відсутній';
  const doctorComment = labTest.notes || 'Коментар відсутній';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Деталі аналізу</h1>

      <div className={styles.analysisHeader}>
        <h2 className={styles.analysisTitle}>{testName}</h2>
        <p className={styles.analysisDate}>Дата проведення: {testDate}</p>
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
            <button onClick={() => fetchLabTestPdf(labTest.id)} className={styles.viewPdf}>
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
          ‹ Повернутися назад до списку аналізів
        </button>
      </div>
    </div>
  );
};

export default PatientAnalyseDetail;
