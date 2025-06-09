import { $authHost } from './index'; 

// Аналітика лікарів
export const fetchTopDoctors = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`api/analytics/top-doctors`, {
      params: { hospitalId },
    });
    return data;
  } catch (error) {
    console.error("Помилка при отриманні топ лікарів:", error);
    throw error;
  }
};

export const fetchWeeklyVisits = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`api/analytics/weekly-visits`, {
      params: { hospitalId },
    });
    return data;
  } catch (error) {
    console.error("Помилка при отриманні щотижневих візитів:", error);
    throw error;
  }
};

export const fetchAverageDoctorRating = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`api/analytics/average-doctor-rating`, {
      params: { hospitalId },
    });
    return data;
  } catch (error) {
    console.error("Помилка при отриманні середнього рейтингу лікарів:", error);
    throw error;
  }
};

export const fetchMostActivePatients = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`api/analytics/most-active-patients`, {
      params: { hospitalId },
    });
    return data;
  } catch (error) {
    console.error("Помилка при отриманні найактивніших пацієнтів:", error);
    throw error;
  }
};

// Фінансові звіти
export const fetchDailyFinancialReport = async () => {
  try {
    const { data } = await $authHost.get(`api/financial-reports/report/day`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні щоденного фінансового звіту:", error);
    throw error;
  }
};

export const fetchMonthlyFinancialReport = async () => {
  try {
    const { data } = await $authHost.get(`api/financial-reports/report/month`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні щомісячного фінансового звіту:", error);
    throw error;
  }
};

export const fetchYearlyFinancialReport = async () => {
  try {
    const { data } = await $authHost.get(`api/financial-reports/report/year`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні річного фінансового звіту:", error);
    throw error;
  }
};
