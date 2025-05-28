import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientEditPersonalInfo.module.css';

import { genderMap } from '../../constants/gender';
import { BLOOD_GROUPS } from '../../constants/bloodType';
import { iconContacts, iconHealth } from '../../utils/icons';

import { updatePatientData, fetchPatientByUserId } from '../../http/patientAPI';
import { DOCTOR_PATIENTS_ROUTE } from '../../utils/consts';

const Field = ({ label, name, value, onChange, type = 'text' }) => (
  <div className={styles.fieldGroup}>
    <label className={styles.label}>{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={styles.inputBox}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className={styles.fieldGroup}>
    <label className={styles.label}>{label}:</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={styles.inputBox}
    >
      <option value="">Не визначено</option>
      {options.map((option) =>
        typeof option === 'string' ? (
          <option key={option} value={option}>{option}</option>
        ) : (
          <option key={option.key} value={option.key}>{option.label}</option>
        )
      )}
    </select>
  </div>
);

const InfoBlock = ({ icon, title, children }) => (
  <div className={styles.infoBlock}>
    <div className={styles.infoItem}>
      <img src={icon} alt={`${title} Icon`} className={styles.infoIcon} />
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
    <div className={styles.section}>{children}</div>
  </div>
);

const DoctorFillPatientsData = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    lastName: '', firstName: '', middleName: '', birthDate: '',
    gender: '', email: '', phone: '', address: '', photo_url: '',
    bloodType: '', chronicConditions: '', allergies: ''
  });

  useEffect(() => {
    const loadPatient = async () => {
      if (!id) return;
      try {
        const fetchedPatient = await fetchPatientByUserId(id);
        setPatient(fetchedPatient);
        setFormData({
          lastName: fetchedPatient.last_name || '',
          firstName: fetchedPatient.first_name || '',
          middleName: fetchedPatient.middle_name || '',
          birthDate: fetchedPatient.birth_date || '',
          gender: fetchedPatient.gender || '',
          email: fetchedPatient.email || '',
          phone: fetchedPatient.phone || '',
          address: fetchedPatient.address || '',
          photo_url: fetchedPatient.photo_url || '',
          bloodType: fetchedPatient.blood_type || '',
          chronicConditions: fetchedPatient.chronic_conditions || '',
          allergies: fetchedPatient.allergies || '',
        });
      } catch {
        setError('Не вдалося завантажити дані пацієнта');
      }
    };

    loadPatient();
  }, [id]);

  const handleChange = ({ target: { name, value } }) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient?.id) return;

    setLoading(true);
    setError(null);

    try {
      const updatedData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [
          key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
          val || null
        ])
      );
      await updatePatientData(patient.id, updatedData);
      navigate(DOCTOR_PATIENTS_ROUTE);
    } catch (err) {
      console.error(err);
      setError('Не вдалося оновити дані пацієнта. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Внесення даних пацієнта</h1>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <div className={styles.containerInfo}>
        <div className={styles.topSection}>
          <div className={styles.personalInfoFields}>
            <Field label="Прізвище" name="lastName" value={formData.lastName} onChange={handleChange} />
            <Field label="Ім’я" name="firstName" value={formData.firstName} onChange={handleChange} />
            <Field label="По батькові" name="middleName" value={formData.middleName} onChange={handleChange} />
            <Field label="Дата народження" name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" />
            <SelectField
              label="Стать"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={Object.entries(genderMap).map(([key, label]) => ({ key, label }))}
            />
          </div>
        </div>

        <InfoBlock icon={iconContacts} title="Контактна інформація">
          <Field label="Електронна пошта" name="email" value={formData.email} onChange={handleChange} />
          <Field label="Номер телефону" name="phone" value={formData.phone} onChange={handleChange} />
          <Field label="Адреса проживання" name="address" value={formData.address} onChange={handleChange} />
        </InfoBlock>

        <InfoBlock icon={iconHealth} title="Інформація про здоров’я">
          <SelectField
            label="Група крові"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            options={BLOOD_GROUPS}
          />
          <Field label="Хронічні захворювання" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} />
          <Field label="Алергії" name="allergies" value={formData.allergies} onChange={handleChange} />
        </InfoBlock>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.saveButton} disabled={loading}>
          {loading ? 'Збереження...' : 'Зберегти'}
        </button>
      </div>
    </form>
  );
};

export default DoctorFillPatientsData;
