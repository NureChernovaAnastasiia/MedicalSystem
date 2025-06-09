import { $host, $authHost } from "./index"; 

export const submitReview = async (reviewData) => {
  try {
    const { data } = await $authHost.post("api/reviews", reviewData);
    return data;
  } catch (error) {
    console.error("Помилка при надсиланні відгуку:", error);
    throw error;
  }
};

export const fetchAllReviews = async () => {
  try {
    const { data } = await $host.get('api/reviews');
    return data;
  } catch (error) {
    console.error("Помилка при отриманні коментарів:", error);
    throw error;
  }
};

export const fetchReviewsByTarget = async (targetType, targetId) => {
  try {
    const { data } = await $host.get(`api/reviews/target/${targetType}/${targetId}`);
    return data;
  } catch (error) {
    console.error("Помилка при отриманні коментарів:", error);
    throw error;
  }
};

export const deleteReview = async (id) => {
  const { data } = await $authHost.delete(`/api/reviews/${id}`);
  return data;
};