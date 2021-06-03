const express = require('express');
const cors = require('cors');
const session = require('express-session');
const {
  PORT,
  CORS_ALLOWED_ORIGINS,
  inTestEnv,
  inProdEnv,
  SESSION_COOKIE_SECRET,
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_DOMAIN,
} = require('./env');
const initRoutes = require('./routes');
const handleRecordNotFoundError = require('./middlewares/handleRecordNotFoundError');
const handleValidationError = require('./middlewares/handleValidationError');
const handleServerInternalError = require('./middlewares/handleServerInternalError');
const sessionStore = require('./sessionStore');

const app = express();

app.set('x-powered-by', false); // for security
app.set('trust proxy', 1);

app.use(express.json());

const allowedOrigins = CORS_ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  session({
    key: SESSION_COOKIE_NAME,
    secret: SESSION_COOKIE_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: inProdEnv,
      domain: SESSION_COOKIE_DOMAIN,
      sameSite: true,
    },
  })
);
app.use(handleRecordNotFoundError);
app.use(handleValidationError);
app.use(handleServerInternalError);

initRoutes(app);

// server setup
const server = app.listen(PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${PORT}`);
  }
});

// process setup : improves error reporting
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', JSON.stringify(error), error.stack);
  process.exit(1);
});

module.exports = server;
