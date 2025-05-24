const {
  MedicalService,
  Patient,
  Doctor,
  MedicalServiceSchedule,
  HospitalMedicalService,
  MedicalServiceInfo,
  Hospital,
} = require("../models/models");

const ApiError = require("../error/ApiError");
const generateMedicalServicePdf = require("../utils/generateMedicalServicePdf");
const { Sequelize, Op } = require("sequelize");

class MedicalServiceController {
  // 🧾 All records (Admin / Doctor only)
  async getAll(req, res, next) {
    try {
      const services = await MedicalService.findAll({
        order: [["id", "DESC"]],
      });

      const results = await Promise.all(
        services.map(async (service) => {
          const schedule = await MedicalServiceSchedule.findByPk(
            service.medical_service_schedule_id,
            {
              include: [
                {
                  model: HospitalMedicalService,
                  include: [{ model: Hospital, attributes: ["id", "name"] }],
                },
              ],
            }
          );

          const hospitalMedicalService = schedule?.HospitalMedicalService;
          const medicalServiceInfo = hospitalMedicalService?.medical_service_info_id
            ? await MedicalServiceInfo.findByPk(hospitalMedicalService.medical_service_info_id)
            : null;

          const patient = await Patient.findByPk(service.patient_id, {
            attributes: ["id", "first_name", "last_name", "email"],
          });

          const doctor = await Doctor.findByPk(service.doctor_id, {
            attributes: ["id", "first_name", "last_name", "specialization"],
          });

          return {
            ...service.toJSON(),
            Patient: patient,
            Doctor: doctor,
            MedicalServiceSchedule: {
              ...schedule?.toJSON(),
              HospitalMedicalService: {
                ...hospitalMedicalService?.toJSON(),
                Hospital: hospitalMedicalService?.Hospital || null,
              },
            },
            MedicalServiceInfo: medicalServiceInfo,
          };
        })
      );

      return res.json(results);
    } catch (error) {
      console.error("❌ getAll error:", error);
      next(ApiError.internal("Помилка отримання списку медичних послуг"));
    }
  }

  // 🧍‍♂️ Послуги пацієнта
  async getByPatient(req, res, next) {
    try {
      const patient_id = req.params.patientId || req.query.patient_id || req.body.patient_id;

      if (!patient_id) {
        return next(ApiError.badRequest("Не вказано ID пацієнта"));
      }

      const services = await MedicalService.findAll({
        where: { patient_id },
        order: [["id", "DESC"]],
      });

      const results = await Promise.all(
        services.map(async (service) => {
          const schedule = await MedicalServiceSchedule.findByPk(service.medical_service_schedule_id, {
            include: [
              {
                model: HospitalMedicalService,
                include: [{ model: Hospital, attributes: ["id", "name"] }],
              },
            ],
          });

          const hospitalMedicalService = schedule?.HospitalMedicalService;
          const medicalServiceInfo = hospitalMedicalService?.medical_service_info_id
            ? await MedicalServiceInfo.findByPk(hospitalMedicalService.medical_service_info_id)
            : null;

          const doctor = await Doctor.findByPk(service.doctor_id, {
            attributes: ["id", "first_name", "last_name", "specialization", "email"],
          });

          return {
            ...service.toJSON(),
            Doctor: doctor,
            MedicalServiceSchedule: {
              ...schedule?.toJSON(),
              HospitalMedicalService: {
                ...hospitalMedicalService?.toJSON(),
                Hospital: hospitalMedicalService?.Hospital || null,
              },
            },
            MedicalServiceInfo: medicalServiceInfo,
          };
        })
      );

      return res.json(results);
    } catch (error) {
      console.error("getByPatient error:", error);
      next(ApiError.internal("Помилка отримання послуг пацієнта"));
    }
  }

  // 👨‍⚕️ Послуги лікаря
  async getByDoctor(req, res, next) {
    try {
      const doctor_id = req.params.doctorId || req.query.doctor_id || req.body.doctor_id;

      if (!doctor_id) {
        return next(ApiError.badRequest("Не вказано ID лікаря"));
      }

      const services = await MedicalService.findAll({
        where: { doctor_id },
        order: [["id", "DESC"]],
      });

      const results = await Promise.all(
        services.map(async (service) => {
          const schedule = await MedicalServiceSchedule.findByPk(service.medical_service_schedule_id, {
            include: [
              {
                model: HospitalMedicalService,
                include: [{ model: Hospital, attributes: ["id", "name"] }],
              },
            ],
          });

          const hospitalMedicalService = schedule?.HospitalMedicalService;
          const medicalServiceInfo = hospitalMedicalService?.medical_service_info_id
            ? await MedicalServiceInfo.findByPk(hospitalMedicalService.medical_service_info_id)
            : null;

          const patient = await Patient.findByPk(service.patient_id, {
            attributes: ["id", "first_name", "last_name", "email"],
          });

          return {
            ...service.toJSON(),
            Patient: patient,
            MedicalServiceSchedule: {
              ...schedule?.toJSON(),
              HospitalMedicalService: {
                ...hospitalMedicalService?.toJSON(),
                Hospital: hospitalMedicalService?.Hospital || null,
              },
            },
            MedicalServiceInfo: medicalServiceInfo,
          };
        })
      );

      return res.json(results);
    } catch (error) {
      console.error("getByDoctor error:", error);
      next(ApiError.internal("Помилка отримання послуг лікаря"));
    }
  }

  // 📄 За ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const service = await MedicalService.findByPk(id);
      if (!service) return next(ApiError.notFound("Медична послуга не знайдена"));

      const patient = await Patient.findByPk(service.patient_id, {
        attributes: ["id", "first_name", "last_name", "email"],
      });

      const doctor = await Doctor.findByPk(service.doctor_id, {
        attributes: ["id", "first_name", "last_name", "specialization"],
      });

      const schedule = await MedicalServiceSchedule.findByPk(service.medical_service_schedule_id, {
        include: [
          {
            model: HospitalMedicalService,
            include: [{ model: Hospital, attributes: ["id", "name"] }],
          },
        ],
      });

      const hospitalMedicalService = schedule?.HospitalMedicalService;
      const medicalServiceInfo = hospitalMedicalService?.medical_service_info_id
        ? await MedicalServiceInfo.findByPk(hospitalMedicalService.medical_service_info_id)
        : null;

      return res.json({
        ...service.toJSON(),
        Patient: patient,
        Doctor: doctor,
        MedicalServiceSchedule: {
          ...schedule?.toJSON(),
          HospitalMedicalService: {
            ...hospitalMedicalService?.toJSON(),
            Hospital: hospitalMedicalService?.Hospital || null,
          },
        },
        MedicalServiceInfo: medicalServiceInfo,
      });
    } catch (error) {
      console.error("getById error:", error);
      next(ApiError.internal("Помилка при пошуку медичної послуги"));
    }
  }

  // ➕ Create
  async create(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для створення"));
      }

      const created = await MedicalService.create(req.body);
      return res.status(201).json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити процедуру"));
    }
  }

  // ✏️ Update
  async update(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав для оновлення"));
      }

      const item = await MedicalService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Процедуру не знайдено"));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення"));
    }
  }

  // 🗑 Delete
  async delete(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(ApiError.forbidden("Недостатньо прав для видалення"));
      }

      const item = await MedicalService.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Процедуру не знайдено"));

      await item.destroy();
      return res.json({ message: "Процедуру видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення"));
    }
  }

  // 📄 PDF download
  async downloadPDF(req, res, next) {
    try {
      const { id } = req.params;

      const service = await MedicalService.findByPk(id, {
        include: [
          { model: Patient, include: [Hospital] },
          { model: Doctor, include: [Hospital] },
        ],
      });

      if (!service) return next(ApiError.notFound("Процедуру не знайдено"));

      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({ where: { user_id: req.user.id } });
        if (!patient || patient.id !== service.patient_id) {
          return next(ApiError.forbidden("Немає доступу до цієї процедури"));
        }
      }

      await generateMedicalServicePdf(service, res);
    } catch (e) {
      console.error("downloadPDF error:", e);
      return next(ApiError.internal("Не вдалося згенерувати PDF"));
    }
  }

  // ✅ Mark service as ready
  async markReadyStatus(req, res, next) {
    try {
      const { id } = req.params;

      const service = await MedicalService.findByPk(id);
      if (!service) return next(ApiError.notFound("Процедуру не знайдено"));

      await service.update({ is_ready: true });

      return res.json({ message: "Процедуру позначено як завершену" });
    } catch (e) {
      console.error("markReadyStatus error:", e);
      return next(ApiError.internal("Не вдалося оновити статус процедури"));
    }
  }
}

module.exports = new MedicalServiceController();