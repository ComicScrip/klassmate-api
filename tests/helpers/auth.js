const request = require('supertest');
const app = require('../../app.js');
const User = require('../../models/user');

const getUserCookie = async (role = 'student') => {
  await User.create({
    firstName: 'john',
    lastName: 'doe',
    email: 'john.doe3000@gmail.com',
    password: 'mySecureP@ssword45!',
    role,
  });

  return request(app)
    .post('/auth/login')
    .send({
      email: 'john.doe3000@gmail.com',
      password: 'mySecureP@ssword45!',
    })
    .then((response) => response.headers['set-cookie']);
};

module.exports = {
  getUserCookie,
};
