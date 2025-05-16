import { $authHost } from "./index";

export const fetchUpcomingAppointments = async (patientId) => {
  const { data } = await $authHost.get(`/api/appointments/upcoming/patient/${patientId}`);
  return data;
};