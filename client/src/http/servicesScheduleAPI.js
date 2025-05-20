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

export const bookMedicalServiceScheduleById = async (medicalServiceScheduleId) => {
  try {
    const { data } = await $authHost.post('api/medical-service-schedules/book', {
      medical_service_schedule_id: medicalServiceScheduleId,
    });
    return data;
  } catch (error) {
    console.error("Помилка при бронюванні розкладу медичної послуги:", error);
    throw error;
  }
};