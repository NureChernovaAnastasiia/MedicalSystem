import { $authHost } from "./index"; 

export const submitReview = async (reviewData) => {
  try {
    const { data } = await $authHost.post("api/reviews", reviewData);
    return data;
  } catch (error) {
    console.error("Помилка при надсиланні відгуку:", error);
    throw error;
  }
};
