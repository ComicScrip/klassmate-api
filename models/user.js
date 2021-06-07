const Joi = require('joi');
const argon2 = require('argon2');
const db = require('../db');

const emailAlreadyExists = (email) =>
  db.user.findFirst({ where: { email } }).then((user) => !!user);

const findByEmail = (email) => db.user.findFirst({ where: { email } });

const hashingOptions = {
  memoryCost: 2 ** 16,
  timeCost: 5,
  type: argon2.argon2id,
};

const findOne = (id) => db.user.findUnique({ where: { id } });

const { findMany } = db.user;

const hashPassword = (plainPassword) =>
  argon2.hash(plainPassword, hashingOptions);

const verifyPassword = (plainPassword, hashedPassword) =>
  argon2.verify(hashedPassword, plainPassword, hashingOptions);

const create = async ({ email, password, firstName, lastName }) => {
  const hashedPassword = await hashPassword(password);
  return db.user.create({
    data: { email, hashedPassword, firstName, lastName },
  });
};

const update = async (id, data) =>
  db.user.update({ where: { id: parseInt(id, 10) }, data });

const validate = (data) =>
  Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(100).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
  }).validate(data, { abortEarly: false }).error;

module.exports = {
  emailAlreadyExists,
  hashPassword,
  create,
  findByEmail,
  verifyPassword,
  validate,
  findOne,
  findMany,
  update,
};
