const { DoctorSchedule, LabTestSchedule, MedicalServiceSchedule } = require("../models/models");
const ApiError = require("../error/ApiError");

/**
 * Виконує пошук і бронювання розкладу
 * @param {string} type - Тип: 'doctor', 'lab', 'service'
 * @param {number} id - ID розкладу
 * @param {function} next - Функція обробки помилок
 * @returns {Promise<string|null>} - Дата прийому або null у разі помилки
 */
async function resolveAndBookSchedule(type, id, next) {
  const scheduleTypes = {
    doctor: {
      model: DoctorSchedule,
      notFound: "Doctor schedule not found",
      booked: "This doctor time slot is already booked"
    },
    lab: {
      model: LabTestSchedule,
      notFound: "Lab test schedule not found",
      booked: "This lab test time slot is already booked"
    },
    service: {
      model: MedicalServiceSchedule,
      notFound: "Medical service schedule not found",
      booked: "This service time slot is already booked"
    }
  };

  const config = scheduleTypes[type];
  if (!config) return null;

  const schedule = await config.model.findByPk(id);
  if (!schedule) return next(ApiError.notFound(config.notFound));
  if (schedule.is_booked) return next(ApiError.badRequest(config.booked));

  await schedule.update({ is_booked: true });
  return schedule.appointment_date;
}

module.exports = { resolveAndBookSchedule };