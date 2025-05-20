import { $host } from "./index"; 

export const fetchHospitalById = async (id) => {
  const { data } = await $host.get(`/api/hospitals/${id}`);
  return data;
};
