const jwt = require('jsonwebtoken');
const User = require('../db/models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const secretKey = process.env.JWT_SECRET;

exports.createUser = async ({ email, login, password }) => {
  const password_hash = await bcrypt.hash(password, saltRounds);
  // Using Sequelize model to create a user
  const user = await User.create({
    email,
    login,
    password_hash 
  });
  return { id: user.user_id, email: user.email, login: user.login };
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
    { userId: user.user_id, email: user.email }, // Payload
    secretKey, // Secret key
    { expiresIn: '24h' } // Token expiration
  );

  return { 
      token: token, 
      userId: user.user_id,
      login: user.login
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
