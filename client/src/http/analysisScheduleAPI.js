import { $authHost } from './index'; 

export const getAvailableLabTestTimes = async (labId, date) => {
  try {
    const { data } = await $authHost.get(`/api/lab-test-schedules/lab/${labId}/date/${date}`);
    return data; 
  } catch (error) {
    console.error('Помилка при отриманні часу бронювання:', error);
    throw error;
  }
};

export const bookLabTestScheduleById = async (labTestScheduleId, orderId) => {
  try {
    const { data } = await $authHost.post('api/lab-test-schedules/pay-and-book', {
      lab_test_schedule_id: labTestScheduleId,
      orderId,
    });
    return data;
  } catch (error) {
    console.error("Помилка при бронюванні розкладу аналізу:", error);
    throw error;
  }
};