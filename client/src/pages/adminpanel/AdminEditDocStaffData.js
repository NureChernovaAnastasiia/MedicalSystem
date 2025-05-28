import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from '../../style/patientpanel/PatientEditPersonalInfo.module.css';

import { fetchDoctorByUserId, updateDoctorData, deleteDoctorById, } from '../../http/doctorAPI';
import { fetchHospitalStaffByUserId, updateStaffData, deleteStaffById, } from '../../http/hospitalStaffAPI';

import ModalChangePhoto from '../../components/modals/ModalChangePhoto';
import ConfirmModal from '../../components/elements/ConfirmModal';

const AdminEditDocStaffData = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const userType = location.state?.userType || 'Doctor';

  const [formData, setFormData] = useState({});
  const [userIdDb, setUserIdDb] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) =>
    setFormData((f) => ({ ...f, [name]: value }));

  const initDoctorData = (doctor) => {
    setFormData({
      first_name: doctor.first_name || '',
      last_name: doctor.last_name || '',
      middle_name: doctor.middle_name || '',
      specialization: doctor.specialization || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      office_number: doctor.office_number || '',
      room_number: doctor.room_number || '',
      experience_start_date: doctor.experience_start_date?.slice(0, 10) || '',
      bio: doctor.bio || '',
      photo_url: doctor.photo_url || '',
    });
    setUserIdDb(doctor.id);
  };

  const initStaffData = (staff) => {
    setFormData({
      first_name: staff.first_name || '',
      last_name: staff.last_name || '',
      middle_name: staff.middle_name || '',
      phone: staff.phone || '',
      email: staff.email || '',
      position: staff.position || '',
    });
    setUserIdDb(staff.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !userType) return;
      try {
        if (userType === 'Doctor') {
          const doctor = await fetchDoctorByUserId(id);
          initDoctorData(doctor);
        } else {
          const staff = await fetchHospitalStaffByUserId(id);
          initStaffData(staff);
        }
      } catch (e) {
        setError('Помилка при завантаженні даних користувача');
      }
    };
    fetchData();
  }, [id, userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (userType === 'Doctor') {
        await updateDoctorData(userIdDb, formData);
      } else {
        await updateStaffData(userIdDb, formData);
      }
      navigate(-1);
    } catch (err) {
      setError('Не вдалося оновити дані. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirm = () => setIsConfirmOpen(true);
  const closeDeleteConfirm = () => setIsConfirmOpen(false);

  const handleDeleteConfirmed = async () => {
    if (!userIdDb) return;
    setDeleteLoading(true);
    setError(null);
    try {
      if (userType === 'Doctor') {
        await deleteDoctorById(userIdDb);
      } else {
        await deleteStaffById(userIdDb);
      }
      navigate(-1);
    } catch (err) {
      setError('Не вдалося видалити користувача. Спробуйте пізніше.');
    } finally {
      setDeleteLoading(false);
      closeDeleteConfirm();
    }
  };

  const openModal = () => {
    setPhotoUrlInput(formData.photo_url);
    setPhotoPreview(formData.photo_url);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleChangePhotoUrl = (url) => {
    setPhotoUrlInput(url);
    setPhotoPreview(url);
  };
  const handleUpload = () => {
    setFormData((f) => ({ ...f, photo_url: photoUrlInput }));
    closeModal();
  };
  const handlePhotoUpdated = (url) => {
    setFormData((f) => ({ ...f, photo_url: url }));
  };

  const getFieldsByUserType = () => {
    const common = [
      { label: 'Прізвище', name: 'last_name' },
      { label: "Ім’я", name: 'first_name' },
      { label: 'По батькові', name: 'middle_name' },
      { label: 'Email', name: 'email', type: 'email' },
      { label: 'Номер телефону', name: 'phone' },
    ];
    const doctor = [
      { label: 'Спеціалізація', name: 'specialization' },
      { label: 'Номер офісу', name: 'office_number' },
      { label: 'Номер кабінету', name: 'room_number' },
      { label: 'Початок роботи', name: 'experience_start_date', type: 'date' },
      { label: 'Біографія', name: 'bio' },
    ];
    const staff = [{ label: 'Посада', name: 'position' }];
    return [...common, ...(userType === 'Doctor' ? doctor : staff)];
  };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Редагування профілю</h1>
        <p className={styles.subtitle}>Оновіть інформацію про користувача</p>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div className={styles.containerInfo}>
          <div className={styles.topSection}>
            <div className={styles.personalInfoFields}>
              {getFieldsByUserType().map(({ label, name, type = 'text' }) => (
                <div key={name} className={styles.fieldGroup}>
                  <label className={styles.label}>{label}:</label>
                  {name === 'bio' ? (
                    <textarea
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className={styles.textAreaBox} 
                        rows={6}
                    />
                    ) : (
                    <input
                        name={name}
                        type={type}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className={styles.inputBox}
                    />
                    )}
                </div>
              ))}
            </div>

            <div className={styles.photoSection}>
              {formData.photo_url ? (
                <img src={formData.photo_url} alt="User" className={styles.profileImage} />
              ) : (
                <div className={styles.noPhoto}>Немає фото</div>
              )}
              <button type="button" className={styles.editText} onClick={openModal}>
                Змінити фото
              </button>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
           <button type="button" className={styles.cancelButton} onClick={openDeleteConfirm}>
                <span className={styles.closeIcon}>×</span>
                <span className={styles.closeText}>Видалити працівникаи</span>
            </button>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Збереження...' : 'Зберегти зміни'}
          </button>
        </div>
      </form>
      
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Підтвердження видалення"
        message="Ви дійсно хочете видалити працівника?"
        onConfirm={handleDeleteConfirmed}
        onCancel={closeDeleteConfirm}
        confirmText="Видалити"
        cancelText="Відміна"
        loading={deleteLoading}
      />

      {isModalOpen && (
        <ModalChangePhoto
          patientId={userIdDb}
          photoPreview={photoPreview}
          initialPhotoUrl={photoUrlInput}
          onClose={closeModal}
          onChangePhotoUrl={handleChangePhotoUrl}
          onUpload={handleUpload}
          onPhotoUpdated={handlePhotoUpdated}
        />
      )}
    </>
  );
};

export default AdminEditDocStaffData;
