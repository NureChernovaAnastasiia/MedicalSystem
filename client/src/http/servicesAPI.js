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

export const fetchMedicalServicePdf = async (serviceId) => {
  try {
    const response = await $authHost.get(`api/medical-services/${serviceId}/pdf`, {
      responseType: 'blob',
    });

    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  } catch (error) {
    console.error('Помилка при отриманні PDF послуги:', error);
    alert('Не вдалося відкрити PDF документ медичної послуги');
  }
};

export const fetchMedicalServicesByDoctorId = async (doctorId) => {
  try {
    const { data } = await $authHost.get(`api/medical-services/by-doctor/${doctorId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні медичних послуг доктора:", error);
    throw error;
  }
};

export const updateMedicalService = async (serviceId, updatedFields) => {
  const { data } = await $authHost.put(`api/medical-services/${serviceId}`, updatedFields);
  return data;
};

export const markMedicalServiceReady = async (serviceId) => {
  const { data } = await $authHost.patch(`api/medical-services/mark-ready/${serviceId}`);
  return data;
};

export const getMedicalServicesByHospital = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`api/medical-services/hospital/${hospitalId}`);
    return data;
  } catch (error) {
    console.error('Помилка при отриманні медичних сервісів:', error);
    throw error;
  }
};
