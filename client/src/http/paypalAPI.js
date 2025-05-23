import { $authHost } from './index'; 

export const createPaypalOrder = async (serviceType, amount) => {
  try {
    const { data } = await $authHost.post('api/paypal/create-order', {
      serviceType,
      amount,
    });
    return data;
  } catch (error) {
    console.error("Помилка при створенні PayPal-замовлення:", error);
    throw error;
  }
};

export const capturePaypalOrder = async (orderId, usedFor, hospitalId) => {
  try {
    const { data } = await $authHost.post('api/paypal/capture-order', {
      orderId,
      usedFor,
      hospitalId,
    });
    return data;
  } catch (error) {
    console.error("Помилка при підтвердженні PayPal-оплати:", error);
    throw error;
  }
};
