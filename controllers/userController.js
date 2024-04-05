// controllers/userController.js
const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// exports.deleteUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     await userService.deleteUser(userId);
//     res.status(200).send({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

exports.modifyPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    await userService.modifyPassword(userId, newPassword);
    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const data = await userService.authenticateUser(req.body);
    res.status(200).send({ data });
  } catch (error) {
    res.status(401).send(error.message);
  }
};

exports.getHasPlayedToday = async (req, res) => {
  try {
      const userId = req.params.userId; 

      if (!userId) {
          return res.status(400).send({ message: "User ID is required" });
      }

      const hasPlayedToday = await userService.getHasPlayedTodayStatus(userId);

      res.status(200).send({ userId, hasPlayedToday });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: error.message });
  }
};
