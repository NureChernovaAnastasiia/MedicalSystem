import { $authHost } from "./index";

export const fetchMedicalRecordsByPatientId = async (patientId) => {
  try {
    const { data } = await $authHost.get(`api/medical-records/patient/${patientId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні медичних записів:", error);
    throw error;
  }
};

export const fetchMedicalRecordById = async (id) => {
  try {
    const { data } = await $authHost.get(`api/medical-records/${id}`);
    return data;
  } catch (error) {
    console.error('Помилка при отриманні медичного запису за ID:', error);
    throw error;
  }
};

export const createMedicalRecord = async (medicalRecordData) => {
  try {
    const { data } = await $authHost.post('api/medical-records', medicalRecordData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні медичного запису:', error);
    throw error;
  }
};