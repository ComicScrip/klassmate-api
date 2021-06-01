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
  }).validate(data, { abortEarly: false }).error;

const findMany = () => db.$queryRaw('SELECT * FROM note');

const findOne = (id) =>
  db.$queryRaw`SELECT * FROM note WHERE id = ${id}`.then((res) => res[0]);

const create = ({ title, content }) =>
  db.$queryRaw`INSERT INTO note (title, content) VALUES (${title}, ${content})`.then(
    () =>
      db.$queryRaw`SELECT LAST_INSERT_ID() AS id`.then((ids) => ({
        title,
        content,
        id: ids[0].id,
      }))
  );

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
