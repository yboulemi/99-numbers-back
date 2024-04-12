const jwt = require('jsonwebtoken');
const User = require('../db/models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const secretKey = process.env.JWT_SECRET;

exports.createUser = async ({ email, login, password }) => {
  try {
    const password_hash = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      email,
      login,
      password_hash
    });

    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      secretKey,
      { expiresIn: '24h' }
    );

    return { token: token, userId: user.user_id, login: user.login, role: user.role };
  } catch (error) {
    // Check for unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Map to identify which field had the unique constraint error
      const errorFields = error.errors.map(err => err.path);
      const errorMessages = {
        email: 'Email already in use',
        login: 'Login already taken'
      };

      // Generate a meaningful error message based on the fields that had the error
      const errorMessage = errorFields.map(field => errorMessages[field]).join(', ');

      throw new Error(errorMessage); // Throw with custom error message
    }
    
    // Rethrow if it's not a unique constraint error
    throw error;
  }
};

// exports.deleteUser = async (userId) => {
//   const deleted = await User.destroy({
//     where: { user_id: userId }
//   });

//   if (!deleted) {
//     throw new Error('User not found');
//   }

//   return { message: 'User deleted successfully' };
// };

exports.modifyPassword = async (userId, newPassword) => {
  const password_hash = await bcrypt.hash(newPassword, saltRounds);

  const [updated] = await User.update(
    { password_hash },
    { where: { user_id: userId } }
  );

  if (!updated) {
    throw new Error('User not found');
  }

  return { message: 'Password updated successfully' };
};


exports.authenticateUser = async ({ email, password }) => {
  // Using Sequelize model to find the user by email
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const match = await bcrypt.compare(password, user.password_hash); 

  if (!match) {
    throw new Error('Password is incorrect');
  }

  // Generate a token
  const token = jwt.sign(
    { userId: user.user_id, email: user.email, role: user.role }, // Payload
    secretKey, // Secret key
    { expiresIn: '24h' } // Token expiration
  );

  return { 
      token: token, 
      userId: user.user_id,
      login: user.login,
      role: user.role
  };
};

exports.getHasPlayedTodayStatus = async (user_id) => {
  try {
      const user = await User.findOne({
          where: { user_id },
          attributes: ['has_played_today'], // Only fetch the 'has_played_today' attribute
      });

      if (!user) {
          throw new Error('User not found');
      }

      // Return the 'has_played_today' status directly as a boolean
      // Assuming 'has_played_today' is stored as an integer (0 or 1) and using the getter method defined in your model
      return user.has_played_today;
  } catch (error) {
      console.error('Error fetching has_played_today status:', error);
      throw error; // Rethrow the error or handle it as needed
  }
};

exports.resetHasPlayedToday = async () => {
  try {
      await User.update({ has_played_today: 0 }, { where: {} }); // Resets for all users
      console.log('Successfully reset `has_played_today` for all users.');
  } catch (error) {
      console.error('Error resetting `has_played_today`:', error);
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ['user_id', 'email', 'login', 'role']  // Specify attributes to avoid sending sensitive data like passwords
    });
    return users;
  } catch (error) {
    console.error('Failed to retrieve users:', error);
    throw error; // Rethrow the error or handle it as needed
  }
};

exports.updateUserRole = async (userId, newRole) => {
  try {
    const [updated] = await User.update({ role: newRole }, {
      where: { user_id: userId }
    });

    if (!updated) throw new Error('No user found with the given ID or no change needed.');

    return { message: 'User role updated successfully.' };
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;  // Rethrow to handle in the controller
  }
};
