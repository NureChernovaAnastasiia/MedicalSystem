import { $authHost } from "./index";

export const fetchPrescriptionsByPatientId = async (patientId) => {
  try {
    const { data } = await $authHost.get(`api/prescriptions/patient/${patientId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні рецептів:", error);
    throw error;
  }
};
