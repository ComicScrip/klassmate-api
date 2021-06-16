const Joi = require('joi');
const db = require('../db');

const findMany = () => db.note.findMany();

const search = async ({ limit, offset, titleOrContentContains, authorId }) => {
  const take = parseInt(limit, 10);
  const skip = parseInt(offset, 10);
  const where = {
    OR: titleOrContentContains
      ? [
          {
            title: {
              contains: titleOrContentContains,
            },
          },
          {
            content: {
              contains: titleOrContentContains,
            },
          },
        ]
      : undefined,
    authorId: authorId ? parseInt(authorId, 10) : undefined,
  };
  const [items, totalMatches] = await Promise.all([
    db.note.findMany({
      take,
      skip,
      where,
      include: {
        author: {
          select: {
            avatarUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    }),
    db.note.count({ where }),
  ]);
  return { items, totalMatches };
};

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

const create = ({ title, content, tags = [], authorId }) =>
  db.note.create({
    data: {
      title,
      content,
      author: authorId
        ? {
            connect: {
              id: authorId,
            },
          }
        : undefined,
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
  search,
};
