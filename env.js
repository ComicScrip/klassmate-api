require('dotenv').config();

function getEnv(varibale) {
  const value = process.env[varibale];
  if (typeof value === 'undefined') {
    console.warn(`Seems like the variable "${varibale}" is not set in the environment. 
    Did you forget to execute "cp .env.sample .env" and adjust variables in the .env file to match your own environment ?`);
  }
  return value;
}

const inProdEnv = getEnv('NODE_ENV') === 'production';
const inDevEnv = getEnv('NODE_ENV') === 'development';
const inTestEnv = getEnv('NODE_ENV') === 'test';

const PORT = getEnv(`PORT${inTestEnv ? '_TEST' : ''}`);
const DATABASE_URL = getEnv(`DATABASE_URL`);

const dbUrlregex =
  /^(?:([^:\/?#\s]+):\/{2})?(?:([^@\/?#\s]+)@)?([^\/?#\s]+)?(?:\/([^?#\s]*))?(?:[?]([^#\s]+))?\S*$/;

const DB_USER = DATABASE_URL.match(dbUrlregex)[2].split(':')[0];
const DB_PASSWORD = DATABASE_URL.match(dbUrlregex)[2].split(':')[1];
const DB_HOST = DATABASE_URL.match(dbUrlregex)[3].split(':')[0];
const DB_PORT = DATABASE_URL.match(dbUrlregex)[3].split(':')[1];
const DB_NAME = DATABASE_URL.match(dbUrlregex)[4].split('/')[0];

const CORS_ALLOWED_ORIGINS = getEnv(`CORS_ALLOWED_ORIGINS`);
const SESSION_COOKIE_DOMAIN = getEnv(`SESSION_COOKIE_DOMAIN`);
const SESSION_COOKIE_NAME = getEnv(`SESSION_COOKIE_NAME`);
const SESSION_COOKIE_SECRET = getEnv(`SESSION_COOKIE_SECRET`);

const API_BASE_URL = getEnv(`API_BASE_URL`);

const SMTP_HOST = getEnv(`SMTP_HOST`);
const SMTP_PORT = getEnv(`SMTP_PORT`);
const SMTP_USER = getEnv(`SMTP_USER`);
const SMTP_PASSWORD = getEnv(`SMTP_PASSWORD`);

const EMAIL_SENDER = getEnv(`EMAIL_SENDER`);
const RESET_PASSWORD_FRONT_URL = getEnv(`RESET_PASSWORD_FRONT_URL`);

module.exports = {
  getEnv,
  inTestEnv,
  inProdEnv,
  inDevEnv,
  PORT,
  CORS_ALLOWED_ORIGINS,
  SESSION_COOKIE_DOMAIN,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_SECRET,
  DATABASE_URL,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  API_BASE_URL,
  EMAIL_SENDER,
  RESET_PASSWORD_FRONT_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
};
