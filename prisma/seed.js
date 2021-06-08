const db = require('../db');

module.exports = async function seed() {
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
    },
  });
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
