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

export const getLabTestSchedulesByHospital = async (hospitalId) => {
  try {
    const { data } = await $authHost.get(`/api/lab-test-schedules/by-hospital/${hospitalId}`);
    return data;
  } catch (error) {
    console.error('Error fetching lab test schedules by hospital:', error);
    throw error;
  }
};

export const getLabTestScheduleById = async (id) => {
  try {
    const { data } = await $authHost.get(`/api/lab-test-schedules/${id}`);
    return data;
  } catch (error) {
    console.error('Помилка при отриманні розкладу лабораторного тесту по ID:', error);
    throw error;
  }
};

export const deleteLabTestScheduleById = async (id) => {
  try {
    const { data } = await $authHost.delete(`/api/lab-test-schedules/${id}`);
    return data;
  } catch (error) {
    console.error('Помилка при видаленні розкладу лабораторного тесту по ID:', error);
    throw error;
  }
};

export const createLabTestSchedule = async (scheduleData) => {
  try {
    const { data } = await $authHost.post('api/lab-test-schedules', scheduleData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні розкладу лабораторного тесту:', error);
    throw error;
  }
};