import React, { useState, useEffect, useContext } from 'react';
import styles from '../../style/modalstyle/ModalCreateHospitalService.module.css';
import { Context } from '../../index';
import { fetchDoctorsByHospitalId } from '../../http/doctorAPI';
import { fetchAvailableLabServices, createHospitalLabService } from '../../http/analysisAPI';
import { fetchAvailableMedicalServices, createHospitalMedicalService } from '../../http/servicesAPI';
import ModalCreateServiceInfo from './ModalCreateServiceInfo';
import AlertPopup from "../../components/elements/AlertPopup";

const ModalCreateHospitalService = ({ onClose, onServiceCreated }) => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [isAnalysis, setIsAnalysis] = useState(true);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);
  const [createType, setCreateType] = useState('lab'); 
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [searchDoctor, setSearchDoctor] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchService, setSearchService] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const doctorsData = await fetchDoctorsByHospitalId(hospitalId);
        setDoctors(doctorsData);

        if (isAnalysis) {
          const tests = await fetchAvailableLabServices(hospitalId);
          setServices(tests);
        } else {
          const medServices = await fetchAvailableMedicalServices(hospitalId);
          setServices(medServices);
        }
      } catch (e) {
        console.error(e);
        setAlert({ message: 'Помилка завантаження даних.', type: 'error' });
      }
    };
    fetchData();
  }, [hospitalId, isAnalysis]);

  useEffect(() => {
    const filtered = doctors.filter((doc) =>
      `${doc.last_name} ${doc.first_name}`.toLowerCase().includes(searchDoctor.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchDoctor, doctors]);

  useEffect(() => {
    const filtered = services.filter((s) =>
        s.name.toLowerCase().includes(searchService.toLowerCase())
    );
    setFilteredServices(filtered);
    }, [searchService, services]);

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedService || !hospitalId) {
        setAlert({ message: 'Будь ласка, виберіть лікаря, послугу та переконайтеся, що лікарня вибрана.', type: 'error' });
        return;
    }
    setLoading(true);
    try {
        const payload = {
        hospital_id: hospitalId,
        doctor_id: selectedDoctor.id,
        ...(isAnalysis
            ? { lab_test_info_id: selectedService.id }
            : { medical_service_info_id: selectedService.id }),
        };

        console.log("Payload to send:", payload);

        if (isAnalysis) {
        await createHospitalLabService(payload);
        } else {
        await createHospitalMedicalService(payload);
        }

        setAlert({ message: "Послугу успішно створено", type: "success" });
        setTimeout(() => {
        onClose();
        onServiceCreated?.();
        }, 1200);
    } catch (e) {
        console.error('Помилка створення послуги:', e?.response?.data || e);
        setAlert({
        message: e?.response?.data?.message || "Не вдалося створити послугу. Спробуйте пізніше.",
        type: "error"
        });
    } finally {
        setLoading(false);
    }
  };

  const handleCreateNewService = () => {
    setCreateType(isAnalysis ? 'lab' : 'medical');
    setShowCreateServiceModal(true);
  };

  const updateServices = async () => {
    try {
      if (isAnalysis) {
        const updatedTests = await fetchAvailableLabServices(hospitalId);
        setServices(updatedTests);
      } else {
        const updatedMedServices = await fetchAvailableMedicalServices(hospitalId);
        setServices(updatedMedServices);
      }
    } catch (e) {
      console.error('Помилка оновлення списку послуг:', e);
      setAlert({ message: 'Помилка оновлення списку послуг.', type: 'error' });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {alert && (
          <AlertPopup
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className={styles.header}>
          <h1 className={styles.title}>Створити послугу</h1>
        </div>

        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${isAnalysis ? styles.active : ''}`}
            onClick={() => setIsAnalysis(true)}
          >
            Аналіз
          </button>
          <button
            className={`${styles.tabButton} ${!isAnalysis ? styles.active : ''}`}
            onClick={() => setIsAnalysis(false)}
          >
            Послуга
          </button>
        </div>

        <div className={styles.columns}>
          <div className={styles.leftSection}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Введіть прізвище або ім’я лікаря"
              value={searchDoctor}
              onChange={(e) => setSearchDoctor(e.target.value)}
            />
            <div className={styles.patientList}>
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className={`${styles.patientCard} ${selectedDoctor?.id === doc.id ? styles.selected : ''}`}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  {doc.last_name} {doc.first_name} {doc.middle_name}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.rightSection}>
            <input
                type="text"
                className={styles.searchInput}
                placeholder={`Введіть назву ${isAnalysis ? 'аналізу' : 'послуги'}`}
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
            />
            <div className={styles.patientList}>
                {filteredServices.map((s) => (
                <div
                    key={s.id}
                    className={`${styles.patientCard} ${selectedService?.id === s.id ? styles.selected : ''}`}
                    onClick={() => setSelectedService(s)}
                >
                    {s.name}
                </div>
                ))}
                <div className={styles.createNewButtonContainer}>
                    <button className={styles.createNewButton} onClick={handleCreateNewService}>
                        + Створити {isAnalysis ? 'новий аналіз' : 'нову послугу'}
                    </button>
                </div>
            </div>
            </div>
        </div>

        <div className={styles.footerButtons}>
          <button className={styles.cancelButton} onClick={onClose} disabled={loading}>
            <span className={styles.closeIcon}>×</span>
            <span className={styles.closeText}>Скасувати</span>
          </button>
          <button
            className={styles.createButton}
            onClick={handleSubmit}
            disabled={!selectedDoctor || !selectedService || loading}
          >
            <span className={styles.createIcon}>✓</span>
            <span className={styles.createText}>
              {loading ? 'Створення...' : 'Створити'}
            </span>
          </button>
        </div>
        {showCreateServiceModal && (
          <ModalCreateServiceInfo
            onClose={() => setShowCreateServiceModal(false)}
            type={createType}
            onCreated={async () => {
              await updateServices();
              setShowCreateServiceModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ModalCreateHospitalService;
