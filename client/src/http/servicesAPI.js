import { $authHost } from "./index";

export const getHospitalMedicalServices = async () => {
  const { data } = await $authHost.get(`api/hospital-medical-services`);
  return data;
};

export const getHospitalMedicalServicesByHospitalId = async (hospitalId) => {
  const { data } = await $authHost.get(`api/hospital-medical-services/hospital/${hospitalId}`);
  return data;
};

export const fetchMedicalServicesByPatientId = async (patientId) => {
  try {
    const { data } = await $authHost.get(`api/medical-services/patient/${patientId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні медичних послуг пацієнта:", error);
    throw error;
  }
};

export const fetchMedicalServiceById = async (serviceId) => {
  try {
    const { data } = await $authHost.get(`api/medical-services/${serviceId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні інформації про медичну послугу:", error);
    throw error;
  }
};