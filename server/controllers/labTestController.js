const {
  LabTest,
  Patient,
  Doctor,
  Hospital,
  LabTestSchedule,
  HospitalLabService,
  LabTestInfo,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const generateLabTestPdf = require("../utils/labTestPdfGenerator");
const { Op } = require("sequelize");

class LabTestController {
  async getAll(req, res, next) {
    try {
      if (req.user.role !== "Admin") {
        return next(ApiError.forbidden("Доступ лише для адміністратора"));
      }

      const items = await LabTest.findAll({
        include: [
          { model: Patient, include: [Hospital] },
          { model: Doctor, include: [Hospital] },
          LabTestSchedule,
        ],
      });

      return res.json(items);
    } catch (e) {
      console.error("getAll error:", e);
      return next(ApiError.internal("Не вдалося отримати список аналізів"));
    }
  }

  async getById(req, res, next) {
    try {
      const item = await LabTest.findByPk(req.params.id, {
        include: [
          { model: Patient, include: [Hospital] },
          { model: Doctor, include: [Hospital] },
          {
            model: LabTestSchedule,
            include: [
              {
                model: HospitalLabService,
                include: [LabTestInfo],
              },
            ],
          },
        ],
      });

      if (!item) return next(ApiError.notFound("Аналіз не знайдено"));

      // Перевірка доступу
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== item.patient_id) {
          return next(ApiError.forbidden("Немає доступу до цього аналізу"));
        }
      }

      const testName =
        item.LabTestSchedule?.HospitalLabService?.LabTestInfo?.name || null;

      return res.json({
        ...item.toJSON(),
        test_name: testName,
        results: item.results || null,
        notes: item.notes || null,
      });
    } catch (e) {
      console.error("getById error:", e);
      return next(ApiError.internal("Помилка отримання аналізу"));
    }
  }

  async getByPatient(req, res, next) {
    try {
      const { patientId } = req.params;

      // Пацієнт має бачити лише свої аналізи
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== parseInt(patientId)) {
          return next(ApiError.forbidden("Немає доступу до чужих аналізів"));
        }
      }

      const items = await LabTest.findAll({
        where: { patient_id: patientId },
        include: [
          {
            model: Doctor,
            include: [Hospital],
          },
          {
            model: LabTestSchedule,
            include: [
              {
                model: HospitalLabService,
                include: [LabTestInfo],
              },
            ],
          },
        ],
      });

      return res.json(items);
    } catch (e) {
      console.error("getByPatient error:", e);
      return next(ApiError.internal("Не вдалося отримати аналізи пацієнта"));
    }
  }
  async getByDoctor(req, res, next) {
    try {
      const doctorId = parseInt(req.params.doctorId);
      if (isNaN(doctorId)) {
        return next(ApiError.badRequest("Некоректний ID лікаря"));
      }

      const labTests = await LabTest.findAll({
        where: { doctor_id: doctorId },
        include: [
          {
            model: Patient,
            attributes: ["first_name", "last_name"],
          },
          {
            model: LabTestSchedule,
            attributes: ["appointment_date", "start_time", "end_time"],
            include: [
              {
                model: HospitalLabService,
                include: [
                  {
                    model: LabTestInfo,
                    attributes: ["name"],
                  },
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const result = labTests.map((test) => {
        const schedule = test.LabTestSchedule;
        const patient = test.Patient;
        const hospitalService = schedule?.HospitalLabService;
        const labTestInfo = hospitalService?.LabTestInfo;

        return {
          id: test.id,
          patient_name: `${patient.first_name} ${patient.last_name}`.trim(),
          test_name: labTestInfo?.name || null,
          appointment_date: schedule?.appointment_date,
          start_time: schedule?.start_time,
          end_time: schedule?.end_time,
          is_ready: test.is_ready,
        };
      });

      return res.json(result);
    } catch (error) {
      console.error("getByDoctor error:", error);
      return next(ApiError.internal("Не вдалося отримати записи для лікаря"));
    }
  }

  async getByPatientStatus(req, res, next) {
    try {
      const { patientId, is_ready } = req.query;
      if (typeof is_ready === "undefined") {
        return next(
          ApiError.badRequest("Потрібно вказати is_ready=true або false")
        );
      }

      const items = await LabTest.findAll({
        where: { patient_id: patientId },
        include: [
          {
            model: LabTestSchedule,
            include: {
              model: HospitalLabService,
              include: [LabTestInfo],
            },
          },
        ],
      });

      const filtered = items.filter(
        (test) =>
          test.LabTestSchedule?.HospitalLabService?.LabTestInfo?.is_ready ===
          (is_ready === "true")
      );

      return res.json(filtered);
    } catch (e) {
      console.error("getByPatientStatus error:", e);
      return next(
        ApiError.internal("Не вдалося отримати аналізи пацієнта за статусом")
      );
    }
  }

  async create(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(
          ApiError.forbidden("Доступ лише для лікаря або адміністратора")
        );
      }

      const created = await LabTest.create(req.body);
      return res.json(created);
    } catch (e) {
      console.error("create error:", e);
      return next(ApiError.badRequest("Не вдалося створити аналіз"));
    }
  }

  async update(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав"));
      }

      const item = await LabTest.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Аналіз не знайдено"));

      await item.update(req.body);
      return res.json(item);
    } catch (e) {
      console.error("update error:", e);
      return next(ApiError.internal("Помилка оновлення аналізу"));
    }
  }

  async delete(req, res, next) {
    try {
      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав"));
      }

      const item = await LabTest.findByPk(req.params.id);
      if (!item) return next(ApiError.notFound("Аналіз не знайдено"));

      await item.destroy();
      return res.json({ message: "Аналіз видалено" });
    } catch (e) {
      console.error("delete error:", e);
      return next(ApiError.internal("Помилка видалення аналізу"));
    }
  }

  async downloadPDF(req, res, next) {
    try {
      const { id } = req.params;
      const labTest = await LabTest.findByPk(id, {
        include: [
          { model: Patient, include: [Hospital] },
          { model: Doctor, include: [Hospital] },
        ],
      });

      if (!labTest) return next(ApiError.notFound("Аналіз не знайдено"));

      // Перевірка доступу
      if (req.user.role === "Patient") {
        const patient = await Patient.findOne({
          where: { user_id: req.user.id },
        });
        if (!patient || patient.id !== labTest.patient_id) {
          return next(ApiError.forbidden("Немає доступу до цього аналізу"));
        }
      }

      await generateLabTestPdf(labTest, res);
    } catch (e) {
      console.error("downloadPDF error:", e);
      return next(ApiError.internal("Не вдалося згенерувати PDF"));
    }
  }
  async markReadyStatus(req, res, next) {
    try {
      const { id } = req.params;

      const labTest = await LabTest.findByPk(id);
      if (!labTest) return next(ApiError.notFound("Lab test not found"));

      await labTest.update({ is_ready: true });

      return res.json({ message: "Lab test marked as ready" });
    } catch (e) {
      console.error("markReady error:", e);
      return next(ApiError.internal("Failed to mark lab test as ready"));
    }
  }
  async getByHospital(req, res, next) {
    try {
      const { hospitalId } = req.params;

      if (!["Admin", "Doctor"].includes(req.user.role)) {
        return next(ApiError.forbidden("Недостатньо прав"));
      }

      const labTests = await LabTest.findAll({
        include: [
          {
            model: Patient,
            include: [{ model: Hospital }],
          },
          {
            model: LabTestSchedule,
            include: [
              {
                model: HospitalLabService,
                include: [LabTestInfo],
              },
            ],
          },
          {
            model: Doctor,
          },
        ],
        where: {
          "$Patient.Hospital.id$": hospitalId,
        },
      });

      const result = labTests.map((test) => {
        const schedule = test.LabTestSchedule;
        const service = schedule?.HospitalLabService;
        const testName = service?.LabTestInfo?.name;

        return {
          id: test.id,
          patient_name: `${test.Patient?.first_name || ""} ${
            test.Patient?.last_name || ""
          }`.trim(),
          doctor_name: `${test.Doctor?.first_name || ""} ${
            test.Doctor?.last_name || ""
          }`.trim(),
          test_name: testName || null,
          appointment_date: schedule?.appointment_date,
          start_time: schedule?.start_time,
          end_time: schedule?.end_time,
          is_ready: test.is_ready,
        };
      });

      return res.json(result);
    } catch (e) {
      console.error("getByHospital error:", e);
      return next(ApiError.internal("Не вдалося отримати аналізи по лікарні"));
    }
  }
}

module.exports = new LabTestController();
