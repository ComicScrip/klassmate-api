const Joi = require('joi');
const db = require('../db');

const findMany = () => db.note.findMany();

const findOne = (id) => db.note.findFirst({ where: { id: parseInt(id, 10) } });

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

const create = ({ title, content, tags = [] }) =>
  db.note.create({
    data: {
      title,
      content,
      tags: {
        connectOrCreate: tags.map(({ name }) => ({
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
  db.note.update({ data, where: { id: parseInt(id, 10) } });

const destroy = (id) =>
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
