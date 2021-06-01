const Joi = require('joi');
const connection = require('../connection');

const findMany = () =>
  connection
    .promise()
    .query('SELECT * FROM note')
    .then(([results]) => results);

const findOne = (id) =>
  connection
    .promise()
    .query('SELECT * FROM note WHERE id = ?', [id])
    .then(([results]) => results[0]);

const validate = (data, forUpdate = false) =>
  Joi.object({
    title: Joi.string()
      .max(255)
      .presence(forUpdate ? 'optional' : 'required'),
    content: Joi.string()
      .max(65535)
      .presence(forUpdate ? 'optional' : 'required'),
  }).validate(data, { abortEarly: false }).error;

const create = ({ title, content }) =>
  connection
    .promise()
    .query('INSERT INTO note (title, content) VALUES (?, ?)', [title, content])
    .then(([result]) => ({ id: result.insertId, title, content }));

const update = (id, data) =>
  connection.promise().query('UPDATE note SET ? WHERE id = ?', [data, id]);

const destroy = (id) =>
  connection
    .promise()
    .query('DELETE FROM note WHERE id = ?', [id])
    .then(([result]) => !!result.affectedRows);

module.exports = {
  findMany,
  findOne,
  validate,
  create,
  update,
  destroy,
};
