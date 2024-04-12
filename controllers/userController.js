const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).send(result);
  } catch (error) {
    if (error.message === 'Email already in use' || error.message === 'Login already taken') {
      res.status(409).send({ message: error.message }); // 409 Conflict
    } else {
      res.status(500).send({ message: "Internal server error" });
    }
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

exports.getAllUsers = async (req, res) => {
  try {
      const users = await userService.getAllUsers();
      res.status(200).send(users);
  } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).send({ message: 'Failed to retrieve users', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params; 
  const { newRole } = req.body; 

  const validRoles = ['admin', 'mod', 'player'];
  if (!validRoles.includes(newRole)) {
    return res.status(400).send({ message: 'Invalid role specified.' });
  }

  try {
    const result = await userService.updateUserRole(userId, newRole);
    res.send(result);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).send({ message: error.message });
  }
};
