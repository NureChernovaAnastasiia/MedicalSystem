import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import styles from '../../style/adminpanel/AdminAnalytics.module.css';
import FinanceReportItem from '../finance/FinanceReportItem';
import FinancePeriodButtons from './FinancePeriodButtons';

export const renderDoctorsChart = (data, avgDoctorRating) => (
  <div>
    {avgDoctorRating && (
      <p className={styles.avgRating}>
        Середній рейтинг лікарів: <strong>{avgDoctorRating}</strong>
      </p>
    )}
    <div className={styles.chartContainer}>
      <div>
        <p className={styles.chartTitle}>Найактивніші лікарі</p>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="appointments" fill="#4c8fe5" radius={[6, 6, 0, 0]} name="Кількість прийомів" />
        </BarChart>
      </div>
    </div>
  </div>
);

export const renderPatientsChart = (data) => (
  <div className={styles.chartContainer}>
    <div>
      <p className={styles.chartTitle}>Найактивніші пацієнти</p>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="visits" fill="#82ca9d" radius={[6, 6, 0, 0]} name="Візити" />
      </BarChart>
    </div>
  </div>
);

export const renderVisitsChart = (data) => (
  <div className={styles.chartContainer}>
    <div>
      <p className={styles.chartTitle}>Відвідування за тиждень</p>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#ff7300" strokeWidth={3} name="Візити" />
      </LineChart>
    </div>
  </div>
);

export const renderFinanceChart = (data, financePeriod, setFinancePeriod, financeDetails) => (
  <>
    <div className={styles.chartContainer}>
      <div>
        <p className={styles.chartTitle}>Фінансовий звіт</p>
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#ffc658" radius={[6, 6, 0, 0]} name="Дохід (₴)" />
        </BarChart>
      </div>
    </div>

    <FinancePeriodButtons financePeriod={financePeriod} setFinancePeriod={setFinancePeriod} />

    <div className={styles.financeReportList}>
      {financeDetails[financePeriod]
        ?.slice()
        .sort((a, b) => new Date(b.report_date) - new Date(a.report_date))
        .map(report => (
          <FinanceReportItem key={report.id} report={report} />
        ))}
    </div>
  </>
);
