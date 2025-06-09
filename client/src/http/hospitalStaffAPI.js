import { $authHost } from './index'; 

export const fetchHospitalStaffByUserId = async (userId) => {
  try {
    const { data } = await $authHost.get(`api/hospital-staff/by-user/${userId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні даних hospital staff за userId", error);
    throw error;
  }
};

export const updateHospitalStaffData = async (id, updatedData) => {
  try {
    const { data } = await $authHost.put(`api/hospital-staff/${id}`, updatedData);
    return data;
  } catch (error) {
    console.error("Помилка при оновленні даних стаффу", error);
    throw error;
  }
};

export const fetchNonDoctorsByHospitalId = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`api/hospital-staff/non-doctors/${hospitalId}`);
    return data;
  } catch (error) {
    console.error(`Помилка при отриманні медичного персоналу для лікарні з ID ${hospitalId}:`, error);
    throw error;
  }
};

export const updateStaffData = async (id, updatedData) => {
  try {
    const { data } = await $authHost.put(`api/hospital-staff/${id}`, updatedData);
    return data;
  } catch (error) {
    console.error("Помилка при оновленні даних персоналу", error);
    throw error;
  }
};

export const deleteStaffById = async (id) => {
  try {
    const { data } = await $authHost.delete(`api/hospital-staff/${id}`);
    return data;
  } catch (error) {
    console.error("Помилка при видаленні працівника лікарні", error);
    throw error;
  }
};

export const fetchUniqueHospitalPositions = async () => {
  const { data } = await $authHost.get('/api/hospital-staff/positions/unique');
  return data;
};