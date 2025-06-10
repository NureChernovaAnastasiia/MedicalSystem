import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import styles from '../../style/adminpanel/AdminAnalytics.module.css';
import FinanceReportItem from '../../components/finance/FinanceReportItem';
import Loader from '../../components/elements/Loader';

import {
  fetchTopDoctors,
  fetchWeeklyVisits,
  fetchAverageDoctorRating,
  fetchMostActivePatients,
  fetchDailyFinancialReport,
  fetchMonthlyFinancialReport,
  fetchYearlyFinancialReport
} from '../../http/analyticsAPI';

const TAB_DOCTORS = 'doctors';
const TAB_PATIENTS = 'patients';
const TAB_VISITS = 'visits';
const TAB_FINANCES = 'finances';

const FinancePeriods = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year'
};

const TabButtons = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: TAB_DOCTORS, label: 'Лікарі' },
    { key: TAB_PATIENTS, label: 'Пацієнти' },
    { key: TAB_VISITS, label: 'Відвідування' },
    { key: TAB_FINANCES, label: 'Фінанси' }
  ];

  return (
    <div className={styles.tabButtons}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.tabButton} ${activeTab === key ? styles.active : ''}`}
          onClick={() => setActiveTab(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const FinancePeriodButtons = ({ financePeriod, setFinancePeriod }) => {
  const periods = [
    { key: FinancePeriods.DAY, label: 'День' },
    { key: FinancePeriods.MONTH, label: 'Місяць' },
    { key: FinancePeriods.YEAR, label: 'Рік' }
  ];

  return (
    <div className={styles.financeButtons}>
      {periods.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.periodButton} ${financePeriod === key ? styles.activePeriod : ''}`}
          onClick={() => setFinancePeriod(key)}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const AdminAnalytics = () => {
  const { hospital } = useContext(Context);
  const hospitalId = hospital?.hospitalId;

  const [activeTab, setActiveTab] = useState(TAB_DOCTORS);
  const [avgDoctorRating, setAvgDoctorRating] = useState(null);
  const [data, setData] = useState([]);
  const [financeDetails, setFinanceDetails] = useState({
    [FinancePeriods.DAY]: [],
    [FinancePeriods.MONTH]: [],
    [FinancePeriods.YEAR]: [],
  });
  const [financePeriod, setFinancePeriod] = useState(FinancePeriods.DAY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataForTab = useCallback(async () => {
    if (!hospitalId && activeTab !== TAB_FINANCES) return;

    setLoading(true);
    setError(null);

    try {
      let result = [];

      switch (activeTab) {
        case TAB_DOCTORS: {
          const [topDoctors, avgRatingData] = await Promise.all([
            fetchTopDoctors(hospitalId),
            fetchAverageDoctorRating(hospitalId)
          ]);
          const avgRating = parseFloat(avgRatingData.averageRating).toFixed(2);
          setAvgDoctorRating(avgRating);

          result = topDoctors.map(doc => ({
            name: `${doc.Doctor.first_name[0]}. ${doc.Doctor.last_name}`.trim(),
            appointments: parseInt(doc.appointments, 10)
          }));
          break;
        }
        case TAB_PATIENTS: {
          const patients = await fetchMostActivePatients(hospitalId);
          result = patients.map(p => ({
            name: `${p.Patient.first_name[0]}. ${p.Patient.last_name}`.trim(),
            visits: parseInt(p.visits, 10)
          }));
          break;
        }
        case TAB_VISITS: {
          const visits = await fetchWeeklyVisits(hospitalId);
          result = visits.map(v => {
            const formattedDate = new Date(v.day).toLocaleDateString('uk-UA');
            return {
              day: formattedDate,
              count: parseInt(v.count, 10)
            };
          });
          break;
        }
        case TAB_FINANCES: {
          const [day, month, year] = await Promise.all([
            fetchDailyFinancialReport(),
            fetchMonthlyFinancialReport(),
            fetchYearlyFinancialReport()
          ]);

          result = [
            { period: 'День', amount: Number(parseFloat(day.total_income).toFixed(2)) },
            { period: 'Місяць', amount: Number(parseFloat(month.total_income).toFixed(2)) },
            { period: 'Рік', amount: Number(parseFloat(year.total_income).toFixed(2)) }
          ];

          setFinanceDetails({
            [FinancePeriods.DAY]: day.reports || [],
            [FinancePeriods.MONTH]: month.reports || [],
            [FinancePeriods.YEAR]: year.reports || [],
          });
          break;
        }
        default:
          result = [];
      }

      setData(result);
    } catch {
      setError('Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  }, [activeTab, hospitalId]);

  useEffect(() => {
    fetchDataForTab();
  }, [fetchDataForTab]);

  const renderDoctorsChart = () => (
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

  const renderPatientsChart = () => (
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

  const renderVisitsChart = () => (
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

  const renderFinanceChart = () => (
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

  const renderChart = () => {
    switch (activeTab) {
      case TAB_DOCTORS:
        return renderDoctorsChart();
      case TAB_PATIENTS:
        return renderPatientsChart();
      case TAB_VISITS:
        return renderVisitsChart();
      case TAB_FINANCES:
        return renderFinanceChart();
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Аналітика</h1>
      </div>

      <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading && <Loader />}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <div className={styles.chartWrapper}>{renderChart()}</div>
      )}
    </div>
  );
};

export default AdminAnalytics;
