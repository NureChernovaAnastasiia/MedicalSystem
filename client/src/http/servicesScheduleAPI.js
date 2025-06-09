import { $authHost } from "./index"; 

export const getAvailableMedicalServiceTimes = async (servId, date) => {
  try {
    const { data } = await $authHost.get(`/api/medical-service-schedules/service/${servId}/date/${date}`);
    return data; 
  } catch (error) {
    console.error('Помилка при отриманні часу бронювання:', error);
    throw error;
  }
};

export const bookMedicalServiceScheduleById = async (medicalServiceScheduleId, orderId) => {
  try {
    const { data } = await $authHost.post('api/medical-service-schedules/book', {
      medical_service_schedule_id: medicalServiceScheduleId,
      orderId,
    });
    return data;
  } catch (error) {
    console.error("Помилка при бронюванні розкладу медичної послуги:", error);
    throw error;
  }
};

export const getMedicalServiceSchedulesByHospital = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`/api/medical-service-schedules/by-hospital/${hospitalId}`);
    return data;
  } catch (error) {
    console.error('Error fetching medical service schedules by hospital:', error);
    throw error;
  }
};

export const getMedicalServiceScheduleById = async (id) => {
  try {
    const { data } = await $authHost.get(`/api/medical-service-schedules/${id}`);
    return data;
  } catch (error) {
    console.error('Помилка при отриманні розкладу медичної послуги по ID:', error);
    throw error;
  }
};

export const deleteMedicalServiceScheduleById = async (id) => {
  try {
    const { data } = await $authHost.delete(`/api/medical-service-schedules/${id}`);
    return data;
  } catch (error) {
    console.error('Помилка при видаленні розкладу медичної послуги по ID:', error);
    throw error;
  }
};

export const createMedicalServiceSchedule = async (scheduleData) => {
  try {
    const { data } = await $authHost.post('api/medical-service-schedules', scheduleData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні розкладу медичної послуги:', error);
    throw error;
  }
};