import React, { useEffect, useState } from 'react';
import styles from '../../style/patientpanel/PatientAnalyseOrder.module.css';

import { getHospitalLabServices } from '../../http/analysisAPI';

import SearchByHospital from '../../components/options/SearchByHospital';
import SearchByCity from '../../components/options/SearchByCity';
import SearchInput from '../../components/options/SearchInput';
import SortByPrice from '../../components/options/SortByPrice';
import AnalyseItem from '../../components/service/AnalyseItem'; 

const PatientAnalyseOrder = () => {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHospitalLabServices();
        setAnalyses(data);
        setFilteredAnalyses(data);
      } catch (error) {
        console.error('Помилка при завантаженні аналізів:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = analyses;

    if (searchTerm.trim()) {
      filtered = filtered.filter(a =>
        a.LabTestInfo?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      filtered = [...filtered].sort((a, b) => a.LabTestInfo.price - b.LabTestInfo.price);
    } else if (sortOrder === 'desc') {
      filtered = [...filtered].sort((a, b) => b.LabTestInfo.price - a.LabTestInfo.price);
    }

    setFilteredAnalyses(filtered);
  }, [searchTerm, selectedHospital, selectedCity, sortOrder, analyses]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Замовлення лабораторних аналізів</h1>
      <p className={styles.subtitle}>
        Оберіть потрібний аналіз, вкажіть зручне місце та час для проходження.
      </p>

      <div className={styles.searchGroup}>
        <div className={styles.inputWrapper}>
          <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Введіть назву аналізу" />
        </div>

        <div className={styles.selectGroup}>
          <SearchByCity value={selectedCity} onChange={setSelectedCity} />
          <SearchByHospital value={selectedHospital} onChange={setSelectedHospital} />
          <SortByPrice value={sortOrder} onChange={setSortOrder} />
        </div>
      </div>

      <div className={styles.tableHeader}>
        <span>Назва аналізу</span>
        <span>Назва лабораторії</span>
        <span>Адреса лабораторії</span>
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

export default PatientAnalyseOrder;

