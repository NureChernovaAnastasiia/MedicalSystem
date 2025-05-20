import { $authHost } from "./index";

export const getHospitalLabServices = async () => {
  const { data } = await $authHost.get(`api/hospital-lab-services`);
  return data;
};

export const getHospitalLabServicesByHospitalId = async (hospitalId) => {
  const { data } = await $authHost.get(`api/hospital-lab-services/hospital/${hospitalId}`);
  return data;
};