import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Context } from '../../index';
import styles from '../../style/adminpanel/AdminAnalytics.module.css';
import TabButtons from '../../components/navbars/TabButtons';
import Loader from '../../components/elements/Loader';
import {
  renderDoctorsChart,
  renderPatientsChart,
  renderVisitsChart,
  renderFinanceChart
} from '../../components/analytics/AnalyticsCharts';
import { FinancePeriods } from '../../components/analytics/FinancePeriodButtons';

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

  const renderChart = () => {
    switch (activeTab) {
      case TAB_DOCTORS:
        return renderDoctorsChart(data, avgDoctorRating);
      case TAB_PATIENTS:
        return renderPatientsChart(data);
      case TAB_VISITS:
        return renderVisitsChart(data);
      case TAB_FINANCES:
        return renderFinanceChart(data, financePeriod, setFinancePeriod, financeDetails);
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Аналітика</h1>
      </div>

      <TabButtons
        tabs={[
          { key: TAB_DOCTORS, label: 'Лікарі' },
          { key: TAB_PATIENTS, label: 'Пацієнти' },
          { key: TAB_VISITS, label: 'Відвідування' },
          { key: TAB_FINANCES, label: 'Фінанси' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className={styles.tabButton}
        activeClassName={styles.active}
        wrapperClassName={styles.tabButtons}
      />

      {loading && <Loader />}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && !error && (
        <div className={styles.chartWrapper}>{renderChart()}</div>
      )}
    </div>
  );
};

export default AdminAnalytics;
