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

export const fetchPrescriptionPdf = async (prescriptionId) => {
  try {
    const response = await $authHost.get(`api/prescriptions/${prescriptionId}/pdf`, {
      responseType: 'blob', 
    });

    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Помилка при отриманні PDF рецепта:', error);
    alert('Не вдалося відкрити PDF документ');
  }
};

export const createPrescription = async (prescriptionData) => {
  try {
    const { data } = await $authHost.post('api/prescriptions', prescriptionData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні рецепту:', error.response?.data || error.message);
    throw error;
  }
};