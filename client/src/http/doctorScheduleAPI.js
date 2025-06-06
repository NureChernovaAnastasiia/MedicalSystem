import { $authHost } from "./index";

export const fetchDoctorScheduleByIdAndDate = async (doctorId, date) => {
    try {
      const { data } = await $authHost.get(`api/doctor-schedules/doctor/${doctorId}/date/${date}`);
      return data;
    } catch (error) {
      console.error("Помилка при отриманні розкладу лікаря за ID і датою:", error);
      throw error;
    }
  };

export const bookDoctorScheduleById = async (scheduleId) => {
  try {
    const { data } = await $authHost.post(`api/doctor-schedules/${scheduleId}/book`);
    return data;
  } catch (error) {
    console.error("Помилка при бронюванні розкладу лікаря:", error);
    throw error;
  }
};

export const fetchDoctorWorkingHoursByIdAndDate = async (doctorId, date) => {
  try {
    const { data } = await $authHost.get(`/api/doctor-schedules/working-hours/${doctorId}/${date}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні робочого графіку лікаря за ID і датою:", error);
    throw error;
  }
};

export const createDoctorSchedule = async (scheduleData) => {
  try {
    const { data } = await $authHost.post('api/doctor-schedules', scheduleData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні розкладу лікаря:', error);
    throw error;
  }
};

export const fetchDoctorScheduleById = async (scheduleId) => {
  try {
    const { data } = await $authHost.get(`api/doctor-schedules/${scheduleId}`);
    return data;
  } catch (error) {
    console.error("Error fetching doctor schedule by ID:", error);
    throw error;
  }
};

export const deleteDoctorScheduleById = async (scheduleId) => {
  try {
    const { data } = await $authHost.delete(`api/doctor-schedules/${scheduleId}`);
    return data;
  } catch (error) {
    console.error("Error deleting doctor schedule by ID:", error);
    throw error;
  }
};