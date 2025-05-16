import { $authHost } from "./index";

export const getHospitalLabServices = async () => {
  const { data } = await $authHost.get(`api/hospital-lab-services`);
  return data;
};
