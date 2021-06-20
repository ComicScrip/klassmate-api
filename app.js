const express = require('express');
const socketIO = require('socket.io');
const { PORT, inTestEnv } = require('./env');
const initRoutes = require('./routes');
const handleRecordNotFoundError = require('./middlewares/handleRecordNotFoundError');
const handleValidationError = require('./middlewares/handleValidationError');
const handleServerInternalError = require('./middlewares/handleServerInternalError');
const sessions = require('./middlewares/sessions');
const cors = require('./middlewares/cors');
const ActivityParticipation = require('./models/activityParticipation');
const User = require('./models/user');

const app = express();

app.set('x-powered-by', false); // for security
app.set('trust proxy', 1);

app.use(express.json());

app.use(cors);
app.use(sessions);

app.use('/file-storage', express.static('file-storage'));

initRoutes(app);

app.use(handleRecordNotFoundError);
app.use(handleValidationError);
app.use(handleServerInternalError);

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

const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
});

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, socket, next);

io.use(wrap(sessions));
io.use(async (socket, next) => {
  try {
    // eslint-disable-next-line
    socket.request.currentUser = await User.findOne(
      socket.request.session.userId
    );
  } catch (err) {
    console.error(err);
    return socket.disconnect();
  }
  return next();
});

io.on('connect', async (socket) => {
  const {
    currentUser: {
      id: userId,
      firstName,
      lastName,
      avatarUrl,
      meetUrl,
      discordId,
    },
  } = socket.request;

  socket.on('joinActivity', async (activityId) => {
    const room = `activity-${activityId}`;
    const activityParticipation = await ActivityParticipation.joinActivity(
      userId,
      activityId
    );
    socket.join(room);
    const participants = (
      await ActivityParticipation.getConnectedUsers(activityId)
    ).map(User.getSafeAttributes);
    socket.emit('activityAttendees', participants);

    socket.to(room).emit(
      'userJoined',
      User.getSafeAttributes({
        id: userId,
        firstName,
        lastName,
        avatarUrl,
        meetUrl,
        discordId,
        completionStatus: activityParticipation.completionStatus,
      })
    );

    socket.on(
      'activityParticipationUpdatedFromClient',
      async ({ completionStatus, energyLevel }) => {
        const updated = User.getSafeAttributes(
          await ActivityParticipation.update({
            userId,
            activityId,
            energyLevel,
            completionStatus,
          })
        );
        socket.to(room).emit('activityParticipationUpdatedFromServer', {
          userId,
          ...updated,
        });
      }
    );

    socket.on('disconnect', async () => {
      console.log('disconnect');
      await ActivityParticipation.leaveActivity(userId, activityId);
      socket.to(room).emit('userLeft', userId);
    });
  });
});

module.exports = server;
