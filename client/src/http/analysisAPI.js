import { $authHost } from "./index";

export const getHospitalLabServices = async () => {
  const { data } = await $authHost.get(`api/hospital-lab-services`);
  return data;
};

export const getHospitalLabServicesByHospitalId = async (hospitalId) => {
  const { data } = await $authHost.get(`api/hospital-lab-services/hospital/${hospitalId}`);
  return data;
};

export const fetchLabTestsByPatientId = async (patientId) => {
  try {
    const { data } = await $authHost.get(`api/lab-tests/patient/${patientId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні аналізів пацієнта:", error);
    throw error;
  }
};

export const fetchLabTestById = async (labTestId) => {
  try {
    const { data } = await $authHost.get(`api/lab-tests/${labTestId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні результату аналізу:", error);
    throw error;
  }
};

export const fetchLabTestPdf = async (labTestId) => {
  try {
    const response = await $authHost.get(`api/lab-tests/${labTestId}/pdf`, {
      responseType: 'blob',
    });

    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Помилка при отриманні PDF аналізу:', error);
    alert('Не вдалося відкрити PDF документ аналізу');
  }
};