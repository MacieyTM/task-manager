const userRepository = require('../repositories/userRepository');
const { hashPassword } = require('../utils/password');

async function getAllUsers() {
  return userRepository.findAll();
}

async function getUserById(id) {
  return userRepository.findById(id);
}

async function createUser(data) {
  const passwordHash = await hashPassword(data.password);

  return userRepository.create({
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    passwordHash,
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
};
