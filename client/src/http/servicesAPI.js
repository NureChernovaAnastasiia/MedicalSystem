import { $authHost } from "./index";

export const getHospitalMedicalServices = async () => {
  const { data } = await $authHost.get(`api/hospital-medical-services`);
  return data;
};
