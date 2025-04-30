function generateReviewEmail({ patientName, targetType, targetName, rating, comment }) {
    const subject =
      targetType === "Hospital"
        ? `Новий відгук про лікарню "${targetName}"`
        : `Новий відгук про лікаря ${targetName}`;
  
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 24px; color: #333; background-color: #fafafa;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; background: #fff; padding: 20px;">
          <h2 style="color: #2c3e50;">📝 Новий відгук від пацієнта <span style="color: #2980b9;">${patientName}</span></h2>
          
          <p><strong>Тип:</strong> ${targetType === "Hospital" ? "Лікарня" : "Лікар"}</p>
          <p><strong>Обʼєкт:</strong> ${targetName}</p>
          <p><strong>Оцінка:</strong> <span style="font-size: 18px;">⭐️ ${rating} / 5</span></p>
  
          <p><strong>Коментар:</strong></p>
          <blockquote style="background: #f0f4f8; padding: 12px 16px; border-left: 4px solid #3498db; font-style: italic; margin: 0;">
            ${comment || "Без коментаря"}
          </blockquote>
  
          <hr style="margin-top: 24px;" />
          <p style="font-size: 12px; color: #999;">Цей лист згенеровано автоматично. Не відповідайте на нього.</p>
        </div>
      </div>
    `;
  
    return { subject, html };
  }
  
  module.exports = generateReviewEmail;
  