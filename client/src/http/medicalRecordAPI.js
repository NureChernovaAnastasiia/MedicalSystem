import { $authHost } from "./index";

export const fetchMedicalRecordsByPatientId = async (patientId) => {
  try {
    const { data } = await $authHost.get(`api/medical-records/${patientId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні медичних записів:", error);
    throw error;
  }
};
