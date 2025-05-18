import { $authHost } from "./index";

export const fetchPatientData = async (id) => {
  try {
    const { data } = await $authHost.get(`api/patients/${id}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні даних пацієнта", error);
    throw error;
  }
};

export const fetchPatientByUserId = async (userId) => {
  try {
    const { data } = await $authHost.get(`api/patients/by-user/${userId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні пацієнта за userId", error);
    throw error;
  }
};

export const updatePatientData = async (id, updatedData) => {
  try {
    const { data } = await $authHost.put(`api/patients/${id}`, updatedData);
    return data;
  } catch (error) {
    console.error("Помилка при оновленні даних пацієнта", error);
    throw error;
  }
};

export const updatePatientPhoto = async (id, photoUrl) => {
  try {
    const { data } = await $authHost.put(`api/patients/${id}/photo`, { photo_url: photoUrl });
    return data;
  } catch (error) {
    throw error;
  }
};