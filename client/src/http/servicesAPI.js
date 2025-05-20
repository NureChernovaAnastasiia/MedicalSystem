import { $authHost } from "./index";

export const getHospitalMedicalServices = async () => {
  const { data } = await $authHost.get(`api/hospital-medical-services`);
  return data;
};

export const getHospitalMedicalServicesByHospitalId = async (hospitalId) => {
  const { data } = await $authHost.get(`api/hospital-medical-services/hospital/${hospitalId}`);
  return data;
};