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

export const fetchAllDoctorAppointments = async (doctorId) => {
  const { data } = await $authHost.get(`/api/appointments/doctor/${doctorId}`);
  return data;
};

export const fetchUpcomingAppointmentsByDoctor = async (doctorId) => {
  const { data } = await $authHost.get(`/api/appointments/upcoming/doctor/${doctorId}`);
  return data;
};

export const fetchAppointmentById = async (appointmentId) => {
  const { data } = await $authHost.get(`/api/appointments/${appointmentId}`);
  return data;
};

export const completeAppointment = async (appointmentId, notes) => {
  const { data } = await $authHost.patch(`/api/appointments/${appointmentId}/complete`);
  return data;
};

export const updateAppointment = async (appointmentId, updatedFields) => {
  const { data } = await $authHost.put(`/api/appointments/${appointmentId}`, updatedFields);
  return data;
};

export const createAppointment = async (appointmentData) => {
  try {
    const { data } = await $authHost.post('api/appointments', appointmentData);
    return data;
  } catch (error) {
    console.error('Помилка при створенні прийому:', error);
    throw error;
  }
};

export const fetchAppointmentsByHospitalAndDate = async (hospitalId, date) => {
  const { data } = await $authHost.get(`api/appointments/by-hospital/${hospitalId}/by-date`, {
    params: { date }
  });
  return data;
};

export const fetchAppointmentsByHospital = async (hospitalId) => {
  const { data } = await $authHost.get(`api/appointments/by-hospital/${hospitalId}`);
  return data;
};