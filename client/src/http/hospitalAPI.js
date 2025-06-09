import { $host, $authHost } from "./index"; 

export const fetchHospitalById = async (id) => {
  const { data } = await $host.get(`/api/hospitals/${id}`);
  return data;
};

export const fetchAllHospitals = async () => {
  try {
    const { data } = await $authHost.get('api/hospitals');
    return data;
  } catch (error) {
    console.error("Помилка при отриманні списку лікарень:", error);
    throw error;
  }
};

export const updateHospitalData = async (id, updatedData) => {
  try {
    const { data } = await $authHost.put(`api/hospitals/${id}`, updatedData);
    return data;
  } catch (error) {
    console.error('Помилка при оновленні даних лікарні', error);
    throw error;
  }
};