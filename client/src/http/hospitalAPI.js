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