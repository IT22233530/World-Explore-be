// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/favorites/add', userController.addFavoriteCountry);
router.post('/favorites/remove', userController.removeFavoriteCountry);
router.get('/favorites/:userId', userController.getFavoriteCountries);

module.exports = router;
