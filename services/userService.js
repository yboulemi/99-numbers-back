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

  const match = await bcrypt.compare(password, user.password_hash); // Ensure field name matches your model

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
