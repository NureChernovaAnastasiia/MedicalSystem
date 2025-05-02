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