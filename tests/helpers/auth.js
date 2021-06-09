const request = require('supertest');
const app = require('../../app.js');
const User = require('../../models/user');

const getUserCookie = async (role = 'student') => {
  await User.create({
    firstName: 'john',
    lastName: 'doe',
    email: 'john.doe@gmail.com',
    password: 'test12345',
    role,
  });

  return request(app)
    .post('/auth/login')
    .send({
      email: 'john.doe@gmail.com',
      password: 'test12345',
    })
    .then((response) => response.headers['set-cookie']);
};

module.exports = {
  getUserCookie,
};
