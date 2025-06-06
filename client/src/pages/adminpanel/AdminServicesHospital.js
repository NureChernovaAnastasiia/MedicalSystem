import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Context } from '../../index';
import SearchInput from '../../components/options/SearchInput';
import ServiceAllHospitalItem from '../../components/service/ServiceAllHospitalItem';
import ConfirmModal from '../../components/elements/ConfirmModal'; 
import ModalCreateHospitalService from '../../components/modals/ModalCreateHospitalService';

import { getHospitalMedicalServicesByHospitalId, deleteHospitalMedicalService } from '../../http/servicesAPI';
import { getHospitalLabServicesByHospitalId, deleteHospitalLabService } from '../../http/analysisAPI';

import styles from '../../style/adminpanel/AdminServices.module.css';

const AdminServicesHospital = () => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [activeTab, setActiveTab] = useState('analyses');
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesData, analysesData] = await Promise.all([
        getHospitalMedicalServicesByHospitalId(hospitalId).catch(() => []),
        getHospitalLabServicesByHospitalId(hospitalId).catch(() => []),
      ]);
      setServices(servicesData);
      setAnalyses(analysesData);
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    if (hospitalId) {
      fetchData();
    }
  }, [hospitalId, fetchData]);

  useEffect(() => {
    if (services.length === 0 && analyses.length > 0) {
      setActiveTab('analyses');
    } else if (analyses.length === 0 && services.length > 0) {
      setActiveTab('services');
    }
  }, [services, analyses]);

  const handleSearch = (item) => {
    const term = searchTerm.toLowerCase();
    const doctor = item.Doctor || {};
    const doctorFullName = `${doctor.last_name ?? ''} ${doctor.first_name ?? ''} ${doctor.middle_name ?? ''}`.toLowerCase();
    const serviceName = (item.LabTestInfo?.name || item.MedicalServiceInfo?.name || '').toLowerCase();
    return doctorFullName.includes(term) || serviceName.includes(term);
  };

  const filteredData = (activeTab === 'services' ? services : analyses)
    .filter(handleSearch)
    .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));

  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);

    try {
      if (deleteType === 'analysis') {
        await deleteHospitalLabService(itemToDelete.id);
        setAnalyses((prev) => prev.filter((a) => a.id !== itemToDelete.id));
      } else if (deleteType === 'service') {
        await deleteHospitalMedicalService(itemToDelete.id);
        setServices((prev) => prev.filter((s) => s.id !== itemToDelete.id));
      }
    } catch (error) {
      console.error('Помилка при видаленні:', error);
    } finally {
      setDeleteLoading(false);
      setModalOpen(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  if (loading) {
    return <p className={styles.loading}>Завантаження даних...</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Послуги лікарні</h1>
        <div className={styles.orderButtonWrapper}>
          <button
            className={styles.orderButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Створити послугу
          </button>
        </div>
      </div>

      <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${activeTab === 'analyses' ? styles.active : ''}`}
          onClick={() => setActiveTab('analyses')}
          disabled={analyses.length === 0}
        >
          Аналізи
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'services' ? styles.active : ''}`}
          onClick={() => setActiveTab('services')}
          disabled={services.length === 0}
        >
          Послуги
        </button>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.searchBox}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Назва послуги або ПІБ лікаря"
          />
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>Назва</span>
        <span>Лікар</span>
      </div>

      <div className={styles.cardsGrid}>
        {filteredData.length ? (
          filteredData.map((item) => (
            <ServiceAllHospitalItem
              key={item.id}
              service={item}
              onDelete={() =>
                handleDeleteClick(item, activeTab === 'analyses' ? 'analysis' : 'service')
              }
            />
          ))
        ) : (
          <p className={styles.noResults}>Нічого не знайдено</p>
        )}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        title="Видалити запис"
        message="Ви дійсно хочете видалити цю послугу?"
        confirmText = 'Видалити'
        cancelText = 'Скасувати'
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
        loading={deleteLoading}
      />

      {isCreateModalOpen && (
        <ModalCreateHospitalService
          onClose={() => setIsCreateModalOpen(false)}
          onServiceCreated={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default AdminServicesHospital;
