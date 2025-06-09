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

export const fetchLabTestsByDoctorId = async (doctorId) => {
  try {
    const { data } = await $authHost.get(`api/lab-tests/doctor/${doctorId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні аналізів доктора:", error);
    throw error;
  }
};

export const updateLabTest = async (labTestId, updatedFields) => {
  const { data } = await $authHost.put(`api/lab-tests/${labTestId}`, updatedFields);
  return data;
};

export const markLabTestReady = async (labTestId) => {
  const { data } = await $authHost.patch(`api/lab-tests/mark-ready/${labTestId}`);
  return data;
};

export const getLabTestsByHospital = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`/api/lab-tests/by-hospital/${hospitalId}`);
    return data;
  } catch (error) {
    console.error('Помилка при отриманні лабораторних тестів:', error);
    throw error;
  }
};

export const deleteHospitalLabService = async (serviceId) => {
  try {
    const { data } = await $authHost.delete(`/api/hospital-lab-services/${serviceId}`);
    return data;
  } catch (error) {
    console.error('Помилка при видаленні лабораторного аналізу:', error);
    throw error;
  }
};

export const fetchLabTestInfo = async () => {
  try {
    const { data } = await $authHost.get('/api/lab-test-info');
    return data;
  } catch (error) {
    console.error('Помилка при отриманні аналізів:', error);
    throw error;
  }
};

export const createHospitalLabService = async (labData) => {
  try {
    const { data } = await $authHost.post('api/hospital-lab-services', labData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні аналізу в лікарні:', error);
    throw error;
  }
};

export const fetchAvailableLabServices = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`/api/hospital-lab-services/available/${hospitalId}`);
    return data;
  } catch (error) {
    console.error('Помилка при отриманні лабораторних послуг:', error);
    throw error;
  }
};

export const createLabTestInfo = async (labData) => {
  try {
    const { data } = await $authHost.post('/api/lab-test-info', labData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні інформації про аналіз:', error);
    throw error;
  }
};

export const deleteLabTest = async (testId) => {
  try {
    const { data } = await $authHost.delete(`/api/lab-tests/${testId}`);
    return data;
  } catch (error) {
    console.error('Помилка при видаленні лабораторного тесту:', error);
    throw error;
  }
};
