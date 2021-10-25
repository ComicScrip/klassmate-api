const express = require('express');
const { PORT, inTestEnv } = require('./env');
const initRoutes = require('./routes');
const handleRecordNotFoundError = require('./middlewares/handleRecordNotFoundError');
const handleValidationError = require('./middlewares/handleValidationError');
const handleServerInternalError = require('./middlewares/handleServerInternalError');
const sessions = require('./middlewares/sessions');
const cors = require('./middlewares/cors');
const { initSockets } = require('./sockets');
const handleForbiddenActionError = require('./middlewares/handleForbiddenActionError');

const app = express();

app.set('x-powered-by', false); // for security
app.set('trust proxy', 1);

app.use(express.json());

app.use(cors);
app.use(sessions);

app.use('/file-storage', express.static('file-storage'));

initRoutes(app);

app.use(handleForbiddenActionError);
app.use(handleRecordNotFoundError);
app.use(handleValidationError);
app.use(handleServerInternalError);

// server setup
const server = app.listen(PORT, () => {
  if (!inTestEnv) {
    console.log(`Server running on port ${PORT}`);
  }
});

initSockets(server);

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
