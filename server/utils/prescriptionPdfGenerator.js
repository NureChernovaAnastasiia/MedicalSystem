const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const { formatDate } = require('./date');

async function generatePrescriptionPdf(prescription, res) {
  const doc = new PDFDocument({ margin: 50 });
  const fileName = `prescription_${prescription.id}.pdf`;

  res.setHeader("Content-disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Content-type", "application/pdf");
  doc.pipe(res);

  const fontPath = path.resolve(__dirname, "../assets/fonts/DejaVuSans.ttf");
  if (fs.existsSync(fontPath)) {
    doc.font(fontPath);
  }

  const patient = prescription.Patient;
  const doctor = prescription.Doctor;
  const hospital = doctor?.Hospital;

  // 🔷 Заголовок
  doc
    .fontSize(18)
    .text("МІНІСТЕРСТВО ОХОРОНИ ЗДОРОВʼЯ УКРАЇНИ", { align: "center" })
    .moveDown(0.2)
    .fontSize(16)
    .text("МЕДИЧНИЙ РЕЦЕПТ", { align: "center", underline: true })
    .moveDown(1);

  // 🔶 Дані пацієнта та лікаря
  doc
    .fontSize(12)
    .text(`Пацієнт: ${patient.last_name} ${patient.first_name} ${patient.middle_name}`)
    .text(`Дата народження: ${formatDate(patient.birth_date)}`)
    .text(`Лікар: ${doctor.last_name} ${doctor.first_name} ${doctor.middle_name}`)
    .text(`Спеціалізація: ${doctor.specialization || "-"}`)
    .text(`Лікарня: ${hospital?.name || "-"}, ${hospital?.address || "-"}`)
    .moveDown(1);

  // 📅 Дати
  doc
    .text(`Дата призначення: ${formatDate(prescription.prescribed_date)}`)
    .text(`Дійсний до: ${formatDate(prescription.prescription_expiration)}`)
    .moveDown(1);

  // 💊 Медикамент
  doc
    .fontSize(13)
    .text("Призначення", { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(`Назва препарату: ${prescription.medication || "-"}`)
    .text(`Форма випуску: ${prescription.form || "-"}`)
    .text(`Дозування: ${prescription.dosage || "-"}`)
    .text(`Кількість за прийом: ${prescription.quantity_per_dose || "-"}`)
    .text(`Частота прийому: ${prescription.frequency || "-"}`)
    .moveDown(1);

  // 📝 Інструкції
  doc
    .fontSize(13)
    .text("Інструкція", { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(prescription.instructions || "-", {
      width: 460,
      lineGap: 4
    })
    .moveDown(2);

  // 🖊 Підпис, печатка, дата
  const signaturePath = path.resolve(__dirname, "../assets/signature.png");
  const stampPath = path.resolve(__dirname, "../assets/stamp.png");

// 📅 Дата видачі (правий верхній кут)
doc
  .fontSize(12)
  .text(`Дата видачі: ${formatDate(new Date())}`, doc.page.width - 170, doc.y);

// Координати
const yBase = doc.y + 30;
const xSignature = 50;
const xStamp = doc.page.width - 170;

// ✒ Підпис
if (fs.existsSync(signaturePath)) {
  doc.image(signaturePath, xSignature, yBase, { width: 120 });
  doc
    .fontSize(11)
    .text("Підпис лікаря", xSignature + 10, yBase + 60);
}

// 🔵 Печатка
if (fs.existsSync(stampPath)) {
  doc.image(stampPath, xStamp, yBase - 10, { width: 100 });
}

// 🖋 Підпис лікаря (нижче)
doc
  .fontSize(11)
  .text("Підпис лікаря", xSignature + 10, yBase + 60);

  doc.end();
}

module.exports = generatePrescriptionPdf;
