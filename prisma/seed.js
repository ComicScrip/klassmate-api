const faker = require('faker');

const db = require('../db');
const User = require('../models/user');

module.exports = async function seed() {
  const hashedPassword = await User.hashPassword('klassmate');
  const admin = await db.user.create({
    data: {
      email: 'klassmate.contact@gmail.com',
      firstName: 'Root',
      lastName: 'Admin',
      hashedPassword,
      role: 'admin',
      avatarUrl:
        'https://img2.pngio.com/roots-vector-png-picture-2038530-roots-vector-png-roots-vector-png-200_200.png',
    },
  });

  const students = await Promise.all(
    Array(10)
      .fill()
      .map(() =>
        db.user.create({
          data: {
            email: faker.unique(faker.internet.email),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            hashedPassword,
          },
        })
      )
  );

  await db.note.create({
    data: {
      title: 'test1',
      content: 'test1content',
      tags: {
        connectOrCreate: [
          { create: { name: 'HTML' }, where: { name: 'HTML' } },
          { create: { name: 'CSS' }, where: { name: 'CSS' } },
        ],
      },
      author: {
        connect: {
          id: admin.id,
        },
      },
    },
  });

  await db.note.createMany({
    data: Array(49)
      .fill(null)
      .map(() => ({
        title: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        authorId: students[Math.floor(Math.random() * students.length)].id,
      })),
  });

  await db.activity.create({ data: { name: 'testactivity' } });
};

module
  .exports()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
