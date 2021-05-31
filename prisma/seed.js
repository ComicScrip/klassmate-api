const db = require('../db');
const User = require('../models/user');

module.exports = async function seed() {
  const hashedPassword = await User.hashPassword('JS/React0321');
  await db.user.createMany({
    data: [
      { lastName: 'BERDALA', firstName: 'Doriane' },
      { lastName: 'BOUTRIG', firstName: 'Youcef' },
      { lastName: 'DUBOIS', firstName: 'Cécile' },
      { lastName: 'GATTO', firstName: 'Ornella' },
      { lastName: 'GERARD', firstName: 'Solène' },
      { lastName: 'JAIMOND', firstName: 'Florian' },
      { lastName: 'JESUS', firstName: 'Nelson' },
      { lastName: 'KAMALO', firstName: 'Herança' },
      { lastName: 'MISSET', firstName: 'Edouard' },
      { lastName: 'MONGE', firstName: 'Brandon' },
      { lastName: 'REDONDO', firstName: 'Benoit' },
      { lastName: 'SCHNUR', firstName: 'Priscilia' },
      { lastName: 'GABORIT', firstName: 'Jonathan' },
      { lastName: 'MAUPIED', firstName: 'Joris' },
    ].map((student) => ({
      ...student,
      email: `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@klassmate.app`,
      hashedPassword,
    })),
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
