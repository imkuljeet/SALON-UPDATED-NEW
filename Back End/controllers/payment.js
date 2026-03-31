const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Appointment = require("../models/Appointment");
const ServiceAvailability = require("../models/ServiceAvailability");
const Service = require("../models/Service");
const transporter = require("../util/mailer");
const Staff = require("../models/Staff");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Step 1: Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { slotId } = req.body;
    const userId = req.user.id;

    const slot = await ServiceAvailability.findByPk(slotId, {
      include: [Service, Staff],
    });
    if (!slot) return res.status(404).json({ message: "Slot not found" });

    const amount = slot.Service.price * 100;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    // Find or create appointment
    let appointment = await Appointment.findOne({ where: { userId, slotId } });
    if (!appointment) {
      appointment = await Appointment.create({ userId, slotId, status: "pending" });
    } else {
      await appointment.update({ status: "pending" });
    }

    // Save order linked to appointment
    await Order.create({
      order_id: order.id,
      status: "PENDING",
      userId,
      appointmentId: appointment.id,
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment order creation failed", error: err.message });
  }
};

// Step 2: Update payment status

exports.updatePaymentStatus = async (req, res) => {
  const { order_id, payment_id } = req.body;
  try {
    const order = await Order.findOne({
      where: { order_id },
      include: Appointment,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.update({ payment_id, status: "SUCCESSFUL" });
    await order.Appointment.update({ status: "booked" });

    res.json({ success: true, message: "Payment successful, appointment confirmed" });
  } catch (err) {
    res.status(500).json({ message: "Payment update failed", error: err.message });
  }
};
