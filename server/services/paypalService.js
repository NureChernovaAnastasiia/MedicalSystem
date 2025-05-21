const paypal = require("@paypal/checkout-server-sdk");
const { UsedOrder, FinancialReport } = require("../models/models");
const { Op } = require("sequelize");

const clientId = "ASeywBe0NF_wNF0UhXCjB0K2EmbgZzG_ulW6iOsVjHYS35kvCL9uEdhXxTxaFV1whFjBSYOCHuU8DhOw";
const clientSecret = "EAYcdVif-jko-rKjWyXSdRUqkpMroZQpUD8QEueFbfa-jXauqfnxf9jzkgjGPO-pZebbodbZpwqqdrRH";

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// ✅ createOrder — Створення замовлення
const createOrder = async (serviceType, amount) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        description: `Оплата за ${serviceType}`,
        amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
  });

  const response = await client.execute(request);
  return response.result;
};

// ✅ captureOrder — Підтвердження замовлення + запис UsedOrder + оновлення FinancialReport
const captureOrder = async (orderId, usedFor, userId, hospitalId = null) => {
  const existing = await UsedOrder.findOne({ where: { order_id: orderId } });
  if (existing) {
    throw new Error("Цей платіж уже був використаний");
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const response = await client.execute(request);

  if (response.result.status === "COMPLETED") {
    const capture = response.result.purchase_units[0].payments.captures[0];
    const breakdown = capture.seller_receivable_breakdown;
    const payer = response.result.payer;

    // ➕ Збереження у UsedOrder
    await UsedOrder.create({
      order_id: orderId,
      used_for: usedFor || "other",
      used_by_user_id: userId,
      payer_email: payer.email_address,
      payer_name: `${payer.name.given_name} ${payer.name.surname}`,
      payer_id: payer.payer_id,
      amount: capture.amount.value,
      currency: capture.amount.currency_code,
      paypal_fee: breakdown.paypal_fee.value,
      net_amount: breakdown.net_amount.value,
      confirmed_at: capture.create_time,
    });

    // 📊 Оновлення фінансового звіту
    if (hospitalId && !isNaN(parseFloat(breakdown.net_amount.value))) {
      const today = new Date();
      const [report] = await FinancialReport.findOrCreate({
        where: {
          hospital_id: hospitalId,
          report_date: {
            [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
          },
        },
        defaults: {
          hospital_id: hospitalId,
          report_date: today,
          total_income: 0,
          total_expenses: 0,
        },
      });

      report.total_income = parseFloat(report.total_income || 0) + parseFloat(breakdown.net_amount.value);
      await report.save();
    }
  }

  return response.result;
};

// 🟢 Експорт
module.exports = {
  createOrder,
  captureOrder,
};