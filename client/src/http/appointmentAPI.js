import { $authHost } from "./index";

export const fetchUpcomingAppointments = async (patientId) => {
  const { data } = await $authHost.get(`/api/appointments/upcoming/patient/${patientId}`);
  return data;
};

export const fetchAllPatientsAppointments = async (patientId) => {
  const { data } = await $authHost.get(`/api/appointments/patient/${patientId}`);
  return data;
};

export const cancelAppointment = async (appointmentId, notes) => {
  const { data } = await $authHost.patch(`/api/appointments/${appointmentId}/cancel`, { notes });
  return data;
};
