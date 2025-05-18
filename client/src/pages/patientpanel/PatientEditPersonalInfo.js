import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../../style/PatientEditPersonalInfo.module.css';

import iconContacts from '../../img/icons/contacts.png';
import iconHealth from '../../img/icons/medical.png';
import iconUnlock from '../../img/icons/unlock.png';

import { updatePatientData } from '../../http/patientAPI';

import ModalChangePhoto from '../../components/modals/ModalChangePhoto'; 

const PatientEditPersonalInfo = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const patient = state?.patient || {};

  const [formData, setFormData] = useState({
    lastName: patient.last_name || '',
    firstName: patient.first_name || '',
    middleName: patient.middle_name || '',
    birthDate: patient.birth_date || '',
    gender: patient.gender || '',
    email: patient.email || '',
    phone: patient.phone || '',
    address: patient.address || '',
    photoUrl: patient.photo_url || '',
    bloodType: patient.blood_type || '',
    chronicConditions: patient.chronic_conditions || '',
    allergies: patient.allergies || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(formData.photoUrl);
  const [photoPreview, setPhotoPreview] = useState(formData.photoUrl);

  const handleChange = ({ target: { name, value } }) => setFormData(f => ({ ...f, [name]: value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updatedData = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`), v || null])
      );
      await updatePatientData(patient.id, updatedData);
      navigate(-1);
    } catch {
      setError('Не вдалося оновити дані пацієнта. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setPhotoUrlInput(formData.photoUrl);
    setPhotoPreview(formData.photoUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChangePhotoUrl = (url) => {
    setPhotoUrlInput(url);
    setPhotoPreview(url);
  };

  const handleUpload = () => {
    setFormData(f => ({ ...f, photoUrl: photoUrlInput }));
    setIsModalOpen(false);
  };

  const personalFields = [
    { label: 'Прізвище', name: 'lastName', type: 'text' },
    { label: "Ім’я", name: 'firstName', type: 'text' },
    { label: 'По батькові', name: 'middleName', type: 'text' },
    { label: 'Дата народження', name: 'birthDate', type: 'date' },
  ];

  const contactFields = [
    { label: 'Електронна пошта', name: 'email' },
    { label: 'Номер телефону', name: 'phone' },
    { label: 'Адреса проживання', name: 'address' },
  ];

  const healthFields = [
    { label: 'Хронічні захворювання', name: 'chronicConditions' },
    { label: 'Алергії', name: 'allergies' },
  ];

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Редагування профілю</h1>
        <p className={styles.subtitle}>Оновіть вашу персональну інформацію, щоб ми могли краще піклуватися про вас.</p>

        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        <div className={styles.containerInfo}>
          <div className={styles.topSection}>
            <div className={styles.personalInfoFields}>
              {personalFields.map(({ label, name, type = 'text' }) => (
                <div key={name} className={styles.fieldGroup}>
                  <label className={styles.label}>{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={styles.inputBox}
                  />
                </div>
              ))}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Стать:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={styles.inputBox}
                >
                  <option value="">Не визначено</option>
                  <option value="Male">Чоловіча</option>
                  <option value="Female">Жіноча</option>
                </select>
              </div>
            </div>

            <div className={styles.photoSection}>
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Patient" className={styles.profileImage} />
              ) : (
                <div className={styles.noPhoto}>Немає фото</div>
              )}
              <button type="button" className={styles.editText} onClick={openModal}>Змінити фото</button>
            </div>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.infoItem}>
              <img src={iconContacts} alt="Contacts Icon" className={styles.infoIcon} />
              <h2 className={styles.sectionTitle}>Контактна інформація</h2>
            </div>
            <div className={styles.section}>
              {contactFields.map(({ label, name }) => (
                <div key={name} className={styles.fieldGroup}>
                  <label className={styles.label}>{label}:</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={styles.inputBox}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.infoItem}>
              <img src={iconHealth} alt="Health Icon" className={styles.infoIcon} />
              <h2 className={styles.sectionTitle}>Інформація про здоров’я</h2>
            </div>
            <div className={styles.section}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Група крові:</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className={styles.inputBox}
                >
                  <option value="">Не визначено</option>
                  {[
                    "A(II) Rh+","A(II) Rh-","B(III) Rh+","B(III) Rh-",
                    "AB(IV) Rh+","AB(IV) Rh-","0(I) Rh+","0(I) Rh-"
                  ].map(bt => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
              {healthFields.map(({ label, name }) => (
                <div key={name} className={styles.fieldGroup}>
                  <label className={styles.label}>{label}:</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={styles.inputBox}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <div className={styles.passwordButton}>
            <img src={iconUnlock} alt="Unlock Icon" className={styles.infoIcon} />
            Змінити пароль
          </div>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>

      {isModalOpen && (
        <ModalChangePhoto
          photoPreview={photoPreview}
          photoUrl={photoUrlInput}
          onClose={closeModal}
          onChangePhotoUrl={handleChangePhotoUrl}
          onUpload={handleUpload}
        />
      )}
    </>
  );
};

export default PatientEditPersonalInfo;

