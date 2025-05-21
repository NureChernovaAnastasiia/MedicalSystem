import React from 'react';
import styles from '../../style/patientpanel/PatientHospitalSchedule.module.css';
import { daysUa } from '../../constants/daysOfWeek';

const DoctorScheduleTable = ({ doctors, weekDates, workingHours }) => {
  return (
    <div className={styles.scheduleWrapper}>
      <div className={styles.dayHeader}>
        <div className={styles.emptyCell}></div>
        {daysUa.map((day) => (
          <div key={day} className={styles.dayItem}>
            <div>{day}</div>
          </div>
        ))}
      </div>

      <div className={styles.scheduleTable}>
        {doctors.map((doctor) => (
          <div key={doctor.id} className={styles.scheduleRow}>
            <div className={styles.doctorName}>
              {doctor.last_name} {doctor.first_name?.charAt(0)}.{doctor.middle_name?.charAt(0)}.
            </div>
            {weekDates.map((date) => {
              const time = workingHours[doctor.id]?.[date];
              return (
                <div key={date} className={styles.scheduleCell}>
                  {time && time.start_time && time.end_time
                    ? `${time.start_time.slice(0, 5)} - ${time.end_time.slice(0, 5)}`
                    : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorScheduleTable;
