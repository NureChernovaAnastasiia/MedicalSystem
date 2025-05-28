import { $authHost } from "./index";

export const fetchDoctorByUserId = async (userId) => {
  try {
    const { data } = await $authHost.get(`api/doctors/by-user/${userId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні лікаря за userId", error);
    throw error;
  }
};

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
  try {
    const { data } = await $authHost.get(`api/doctors/${id}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні даних лікаря", error);
    throw error;
  }
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

export const updateDoctorData = async (id, updatedData) => {
  try {
    const { data } = await $authHost.put(`api/doctors/${id}`, updatedData);
    return data;
  } catch (error) {
    console.error("Помилка при оновленні даних лікаря", error);
    throw error;
  }
};

export const deleteDoctorById = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/doctors/${id}`);
    return data;
  } catch (error) {
    console.error("Помилка при видаленні лікаря", error);
    throw error;
  }
};