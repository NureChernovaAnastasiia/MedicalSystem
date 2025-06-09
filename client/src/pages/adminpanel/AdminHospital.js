import React, { useContext, useEffect, useState } from 'react';
import styles from '../../style/patientpanel/PatientHospitalDetails.module.css';

import { Context } from '../../index';
import { fetchHospitalById } from '../../http/hospitalAPI';

import HospitalHeader from '../../components/hospital/HospitalHeader';
import HospitalReviewsBlock from '../../components/hospital/HospitalReviewsBlock';

const AdminHospital = () => {
  const { hospital } = useContext(Context); 
  const [hospitalData, setHospitalData] = useState(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      if (!hospital?.hospital?.id) return;

      try {
        const hospitalInfo = await fetchHospitalById(hospital.hospital.id);
        setHospitalData(hospitalInfo);

      } catch (error) {
        console.error('Помилка при завантаженні даних лікарні:', error);
      }
    };

    fetchHospitalData();
  }, [hospital]);

  return (
    <div className={styles.container}>
      {hospitalData && <HospitalHeader hospital={hospitalData} />}

      {hospitalData && <HospitalReviewsBlock hospitalId={hospitalData.id} />}

    </div>
  );
};

export default AdminHospital;
