import { $authHost } from "./index";

export const fetchAllDoctors = async () => {
  try {
    const { data } = await $authHost.get('api/doctors');
    return data;
  } catch (error) {
    console.error("Помилка при отриманні списку лікарів:", error);
    throw error;
  }
};

export const fetchDoctorById = async (id) => {
  const { data } = await $authHost.get(`/api/doctors/${id}`);
  return data;
};

export const fetchDoctorSpecializations = async () => {
  const { data } = await $authHost.get('/api/doctors/specializations');
  return data;
};

export const fetchUniqueHospitalNames = async () => {
  const { data } = await $authHost.get('/api/hospitals/unique-names');
  return data;
};

export const fetchDoctorsByHospitalId = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`api/doctors/by-hospital/${hospitalId}`);
    return data;
  } catch (error) {
    console.error(`Помилка при отриманні лікарів для лікарні з ID ${hospitalId}:`, error);
    throw error;
  }
};