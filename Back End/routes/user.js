const express = require('express');
const router = express.Router();
const { signup, login,getAllCustomers, deleteUser,promoteUser } = require('../controllers/user');
const User = require("../models/User");
const authenticate = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);

// Middleware to check admin role
function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
}

router.get('/all', authenticate, isAdmin, getAllCustomers);
router.delete('/:id', authenticate, isAdmin, deleteUser);
router.put('/promote/:id', authenticate, isAdmin, promoteUser);

module.exports = router;
