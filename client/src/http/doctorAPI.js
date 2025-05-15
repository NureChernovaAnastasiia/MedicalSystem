import { $authHost } from "./index";

export const fetchAllDoctors = async () => {
  try {
    const { data } = await $authHost.get('api/doctors');
    return data;
  } catch (error) {
    console.error("Помилка при отриманні списку лікарів:", error);
    throw error;
  }
};