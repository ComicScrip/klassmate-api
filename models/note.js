const Joi = require('joi');
const db = require('../db');

const validate = (data, forUpdate = false) =>
  Joi.object({
    title: Joi.string()
      .max(255)
      .presence(forUpdate ? 'optional' : 'required'),
    content: Joi.string()
      .max(65535)
      .presence(forUpdate ? 'optional' : 'required'),
    tags: Joi.array(),
  }).validate(data, { abortEarly: false }).error;

const findMany = () => db.note.findMany();

const findOne = (id) =>
  db.note.findFirst({
    where: { id: parseInt(id, 10) },
    include: { tags: true },
  });

const create = ({ title, content, tags }) =>
  db.note.create({
    data: {
      title,
      content,
      author: {
        connectOrCreate: {
          create: {
            email: 'john.doe@gmail.com',
            firstName: 'john',
            lastName: 'doe',
            hashedPassword: 'uefheziufhe',
          },
          where: {
            email: 'john.doe@gmail.com',
          },
        },
      },
      tags: {
        connectOrCreate: (tags || []).map(({ name }) => ({
          create: { name },
          where: { name },
        })),
      },
    },
    include: {
      tags: true,
    },
  });

const update = (id, data) =>
  db.note.update({ where: { id: parseInt(id, 10) }, data });

const destroy = async (id) =>
  db.note
    .delete({ where: { id: parseInt(id, 10) } })
    .then(() => true)
    .catch(() => false);

module.exports = {
  findMany,
  findOne,
  validate,
  create,
  update,
  destroy,
};
