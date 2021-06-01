require('dotenv').config();
// Make sure the test DB is used
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;

const db = require('../db.js');
const connection = require('../connection');
const app = require('../app.js');

let tableNames = null;
async function getTableNames() {
  if (!tableNames) {
    const dbUrlregex =
      /^(?:([^:\/?#\s]+):\/{2})?(?:([^@\/?#\s]+)@)?([^\/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/;
    const dbName =
      process.env.DATABASE_URL_TEST.match(dbUrlregex)[4].split('/')[0];
    tableNames = (
      await db.$queryRaw(
        `SELECT table_name FROM information_schema.tables where LOWER(table_schema) = '${dbName}' AND table_name != '_prisma_migrations'`
      )
    ).map((row) => row.table_name || row.TABLE_NAME);
  }
  return tableNames;
}

const deleteAllDBData = async () => {
  await db.$executeRaw('SET FOREIGN_KEY_CHECKS=0;');
  const names = await getTableNames();
  await Promise.all(
    names.map((tableName) => db.$executeRaw(`TRUNCATE ${tableName}`))
  );
  await db.$executeRaw('SET FOREIGN_KEY_CHECKS=1;');
};

const closeApp = () =>
  new Promise((resolve, reject) => {
    app.close((err) => {
      if (err) reject(err);
      else setTimeout(resolve, 0); // Jest seem to detect open handles when they aren't any... Or is it app.close() that triggers the callback before the handle is actually freed ? https://nodejs.org/api/http.html#http_server_close_callback
    });
  });

beforeAll(deleteAllDBData);
afterEach(deleteAllDBData);
afterAll(async () => {
  await new Promise((resolve) => connection.end(resolve));
  await db.$disconnect();
  await closeApp();
});
