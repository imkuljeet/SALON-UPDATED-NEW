const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const ReviewReply = require('../models/ReviewReply');
const User = require('../models/User');

exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId, staffId, serviceId, rating, comment } = req.body;

    // Validate appointment belongs to user
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized or invalid appointment' });
    }

    // Prevent duplicate review for same appointment
    const existing = await Review.findOne({ where: { appointmentId } });
    if (existing) {
      return res.status(400).json({ message: 'Review already submitted for this appointment' });
    }

    const review = await Review.create({
      userId,
      appointmentId,
      staffId,
      serviceId,
      rating,
      comment
    });

    return res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
const reviews = await Review.findAll({
  include: [
    Service,
    Staff,
    User,
    { model: ReviewReply, include: [User] } // include replies + admin info
  ]
});

    return res.status(200).json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.findAll({
      where: { userId },
      include: [Appointment, Service, Staff],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ reviews });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.replyToReview = async (req, res) => {
  try {
    const { reviewId, reply } = req.body;
    const adminId = req.user.id; // assuming JWT auth for admins

    if (!reply) {
      return res.status(400).json({ message: 'Reply cannot be empty' });
    }

    const newReply = await ReviewReply.create({
      reviewId,
      reply,
      adminId
    });

    return res.status(201).json({ message: 'Reply submitted successfully', reply: newReply });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

