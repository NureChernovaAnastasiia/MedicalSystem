const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const { formatDate } = require('./date');

async function generateLabTestPdf(labTest, res) {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=lab-test-${labTest.id}.pdf`);
  doc.pipe(res);

  const fontPath = path.join(__dirname, '../assets/fonts/DejaVuSans.ttf');
  if (fs.existsSync(fontPath)) {
    doc.registerFont('UkrainianFont', fontPath);
    doc.font('UkrainianFont');
  }

  const patient = labTest.Patient;
  const doctor = labTest.Doctor;
  const hospital = patient?.Hospital || doctor?.Hospital;

  // 🔷 Заголовок
  doc
    .fontSize(18)
    .text("МІНІСТЕРСТВО ОХОРОНИ ЗДОРОВʼЯ УКРАЇНИ", { align: "center" })
    .moveDown(0.2)
    .fontSize(16)
    .text("ЛАБОРАТОРНИЙ АНАЛІЗ", { align: "center", underline: true })
    .moveDown(0.8)
    .fontSize(12)
    .text(`Лікарня: ${hospital?.name || '-'}, ${hospital?.address || '-'}`, {
      align: "left"
    })
    .moveDown(1);

  // 🔶 Дані пацієнта та лікаря
  doc
    .fontSize(12)
    .text(`Пацієнт: ${patient?.last_name} ${patient?.first_name} ${patient?.middle_name || ''}`)
    .text(`Дата народження: ${formatDate(patient?.birth_date)}`)
    .text(`Лікар: ${doctor?.last_name} ${doctor?.first_name} ${doctor?.middle_name || ''}`)
    .text(`Спеціалізація: ${doctor?.specialization || '-'}`)
    .moveDown(1);

  // 📅 Дати
  doc
    .text(`Дата створення запису: ${formatDate(labTest.createdAt)}`)
    .moveDown(1);

  // 📊 Результати
  doc
    .fontSize(13)
    .text("Результати аналізу", { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(labTest.results || 'Результати відсутні')
    .moveDown(1);

  doc
    .fontSize(13)
    .text("Примітки", { underline: true })
    .moveDown(0.5)
    .fontSize(12)
    .text(labTest.notes || 'Без приміток')
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

module.exports = generateLabTestPdf;
