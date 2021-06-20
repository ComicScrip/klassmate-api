const Joi = require('joi');
const db = require('../db');

const findMany = () => db.activity.findMany();

const search = async ({ limit, offset, nameContains }) => {
  const take = parseInt(limit, 10);
  const skip = parseInt(offset, 10);
  const where = {
    name: {
      contains: nameContains,
    },
  };
  const [items, totalMatches] = await Promise.all([
    db.activity.findMany({
      take,
      skip,
      where,
      orderBy: [{ createdAt: 'desc' }],
    }),
    db.activity.count({ where }),
  ]);
  return { items, totalMatches };
};

const findOne = (id) =>
  db.activity.findFirst({ where: { id: parseInt(id, 10) } });

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

const create = ({ name }) => db.activity.create({ data: { name } });

const update = (id, data) =>
  db.activity.update({ data, where: { id: parseInt(id, 10) } });

const destroy = (id) =>
  db.activity
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
  search,
};
