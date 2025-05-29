import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";

// Функція для входу користувача
export const login = async (email, password) => {
  try {
    const { data } = await $host.post("api/users/login", { email, password });
    localStorage.setItem("token", data.token);
    return jwtDecode(data.token);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Помилка під час входу. Спробуйте пізніше.");
    }
  }
};

// Функція для перевірки автентичності користувача
export const check = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен не знайдено");
  }

  try {
    const { data } = await $authHost.get("api/users/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.setItem("token", data.token);  // Оновлення токену
    return jwtDecode(data.token);
  } catch (error) {
    console.error("Помилка при перевірці ролі користувача:", error);
    throw error;  
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  const { data } = await $authHost.post("api/users/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await $authHost.post("api/users/registration", userData);
  return data;
};