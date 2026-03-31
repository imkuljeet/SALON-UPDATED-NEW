const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth'); // assuming you have JWT auth

router.post('/create', authMiddleware, reviewController.createReview);
router.get('/all', authMiddleware, reviewController.getReviews);
router.get('/my', authMiddleware, reviewController.getMyReviews);
router.post('/reply', authMiddleware, reviewController.replyToReview);
router.get('/reply/:reviewId', authMiddleware, reviewController.getReviewReplies);


module.exports = router;
