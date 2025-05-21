import React, { useEffect, useState } from 'react';
import styles from '../../style/patientpanel/PatientAnalyseOrder.module.css';

import { getHospitalMedicalServices } from '../../http/servicesAPI';  

import SearchByHospital from '../../components/options/SearchByHospital';
import SearchByCity from '../../components/options/SearchByCity';
import SearchInput from '../../components/options/SearchInput';
import SortByPrice from '../../components/options/SortByPrice';
import AnalyseItem from '../../components/service/AnalyseItem'; 

const PatientServiceOrder = () => {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHospitalMedicalServices(); 
        setAnalyses(data);
        setFilteredAnalyses(data);
      } catch (error) {
        console.error('Помилка при завантаженні послуг:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = analyses;

    if (searchTerm.trim()) {
      filtered = filtered.filter(a =>
        a.MedicalServiceInfo?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedHospital) {
      filtered = filtered.filter(a => a.Hospital?.name === selectedHospital);
    }
    if (selectedCity) {
      filtered = filtered.filter(a =>
        a.Hospital?.address?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    if (sortOrder === 'asc') {
      filtered = [...filtered].sort((a, b) => a.MedicalServiceInfo.price - b.MedicalServiceInfo.price);
    } else if (sortOrder === 'desc') {
      filtered = [...filtered].sort((a, b) => b.MedicalServiceInfo.price - a.MedicalServiceInfo.price);
    }

    setFilteredAnalyses(filtered);
  }, [searchTerm, selectedHospital, selectedCity, sortOrder, analyses]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Замовлення медичних послуг</h1>
      <p className={styles.subtitle}>
        Оберіть потрібну послугу, вкажіть зручне місце та час для проходження.
      </p>

      <div className={styles.searchGroup}>
        <div className={styles.inputWrapper}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Введіть назву послуги" />
        </div>

        <div className={styles.selectGroup}>
          <SearchByCity value={selectedCity} onChange={setSelectedCity} />
          <SearchByHospital value={selectedHospital} onChange={setSelectedHospital} />
          <SortByPrice value={sortOrder} onChange={setSortOrder} />
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>Назва послуги</span>
        <span>Назва закладу</span>
        <span>Адреса закладу</span>
        <span>Ціна</span>
      </div>

      <div className={styles.analyseList}>
        {filteredAnalyses.map((analyse, index) => (
          <AnalyseItem key={index} analyse={analyse} />
        ))}
      </div>
    </div>
  );
};

export default PatientServiceOrder;
