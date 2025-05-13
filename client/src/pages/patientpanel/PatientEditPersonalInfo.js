import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../style/PatientEditPersonalInfo.module.css';

import iconContacts from '../../img/icons/contacts.png';
import iconHealth from '../../img/icons/medical.png';
import iconUnlock from '../../img/icons/unlock.png';
import photo from '../../img/Woman1.jpg';

const PatientEditPersonalInfo = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    lastName: 'Коваль',
    firstName: 'Анастасія',
    middleName: 'Іванівна',
    birthDate: '2004-08-12',
    gender: 'Жіноча',
    email: 'anastasiya.koval@gmail.com',
    phone: '+380 671234567',
    address: 'м. Київ, Україна, вул. Лесі Українки, 25',
    bloodType: 'A(II) Rh+',
    chronicDiseases: 'Астма',
    allergies: 'Не виявлено',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Редагування профілю</h1>
      <p className={styles.subtitle}>Оновіть вашу персональну інформацію, щоб ми могли краще піклуватися про вас.</p>

      <div className={styles.containerInfo}>
        <div className={styles.topSection}>
          <div className={styles.personalInfoFields}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Прізвище:</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Ім’я:</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>По батькові:</label>
              <input name="middleName" value={formData.middleName} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Дата народження:</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Стать:</label>
              <input name="gender" value={formData.gender} onChange={handleChange} className={styles.inputBox} />
            </div>
          </div>

          <div className={styles.photoSection}>
            <img src={photo} alt="Patient" className={styles.profileImage} />
            <button type="button" className={styles.editText}>Змінити фото</button>
          </div>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.infoItem}>
            <img src={iconContacts} alt="Contacts Icon" className={styles.infoIcon} />
            <h2 className={styles.sectionTitle}>Контактна інформація</h2>
          </div>
          <div className={styles.section}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Електронна пошта:</label>
              <input name="email" value={formData.email} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Номер телефону:</label>
              <input name="phone" value={formData.phone} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Адреса проживання:</label>
              <input name="address" value={formData.address} onChange={handleChange} className={styles.inputBox} />
            </div>
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
              <input name="bloodType" value={formData.bloodType} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Хронічні захворювання:</label>
              <input name="chronicDiseases" value={formData.chronicDiseases} onChange={handleChange} className={styles.inputBox} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Алергії:</label>
              <input name="allergies" value={formData.allergies} onChange={handleChange} className={styles.inputBox} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <div type="button" className={styles.passwordButton}>
          <img src={iconUnlock} alt="Unlock Icon" className={styles.infoIcon} />
          Змінити пароль
        </div>
        <button type="submit" className={styles.saveButton}>Зберегти зміни</button>
      </div>
    </form>
  );
};

export default PatientEditPersonalInfo;
