const paypal = require("@paypal/checkout-server-sdk");
const { UsedOrder, FinancialReport } = require("../models/models");
const { Op } = require("sequelize");

const clientId = "";
const clientSecret = "";

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// ✅ Створення замовлення
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

// ✅ Підтвердження замовлення (але без збереження)
const captureOrder = async (orderId) => {
  const existing = await UsedOrder.findOne({ where: { order_id: orderId } });
  if (existing) throw new Error("Цей платіж уже був використаний");

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const response = await client.execute(request);

  if (response.result.status !== "COMPLETED") {
    throw new Error("Оплата не підтверджена");
  }

  const capture = response.result.purchase_units[0].payments.captures[0];
  const breakdown = capture.seller_receivable_breakdown;
  const payer = response.result.payer;

  return {
    status: response.result.status,
    order_id: orderId,
    payer,
    capture,
    amount: capture.amount.value,
    currency: capture.amount.currency_code,
    paypal_fee: breakdown.paypal_fee.value,
    net_amount: breakdown.net_amount.value,
    confirmed_at: capture.create_time,
  };
};

// ✅ Збереження використаного платежу та оновлення фінзвіту
const getSafeFloat = (value) => {
  if (typeof value === "string") return parseFloat(value);
  if (typeof value === "number") return value;
  console.warn("⚠️ Unexpected number format:", value);
  return NaN;
};

const saveUsedOrder = async (payment, usedFor, userId, hospitalId = null) => {
  const capture = payment.capture;
  const breakdown = capture.seller_receivable_breakdown;
  const payer = payment.payer;

  const amount = getSafeFloat(capture.amount.value);
  const paypal_fee = getSafeFloat(breakdown.paypal_fee.value);
  const net_amount = getSafeFloat(breakdown.net_amount.value);

  if ([amount, paypal_fee, net_amount].some(isNaN)) {
    console.error("❌ Invalid number in payment values", {
      amount,
      paypal_fee,
      net_amount,
    });
    throw new Error("Некоректні числові значення");
  }

  await UsedOrder.create({
    order_id: payment.order_id,
    used_for: usedFor || "other",
    used_by_user_id: userId,
    payer_email: payer.email_address,
    payer_name: `${payer.name.given_name} ${payer.name.surname}`,
    payer_id: payer.payer_id,
    amount,
    currency: capture.amount.currency_code,
    paypal_fee,
    net_amount,
    confirmed_at: capture.create_time,
  });

  if (hospitalId) {
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

  // 🔧 Правильне додавання чисел
  const currentIncome = parseFloat(report.total_income || 0);
  const updatedIncome = currentIncome + net_amount;

  await report.update({ total_income: updatedIncome });
}
};

// 🟢 Експорт функцій
module.exports = {
  createOrder,
  captureOrder,
  saveUsedOrder,
};
