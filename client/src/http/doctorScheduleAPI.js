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