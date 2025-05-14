// controllers/userController.js
const User = require('../models/User');

// Add a country to favorites
exports.addFavoriteCountry = async (req, res) => {
  const { userId, countryCode } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteCountries: countryCode } }, // avoid duplicates
      { new: true }
    );
    res.json(user.favoriteCountries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove a country from favorites
exports.removeFavoriteCountry = async (req, res) => {
  const { userId, countryCode } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteCountries: countryCode } },
      { new: true }
    );
    res.json(user.favoriteCountries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's favorite countries
exports.getFavoriteCountries = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.json(user.favoriteCountries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
