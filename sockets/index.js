const socketIO = require('socket.io');
const { CORS_ALLOWED_ORIGINS } = require('../env');
const sessions = require('../middlewares/sessions');
const User = require('../models/user');
const { manageActivityRooms } = require('./activityRooms');

const initSockets = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: CORS_ALLOWED_ORIGINS.split(','),
      credentials: true,
    },
  });

  io.use((socket, next) => sessions(socket.request, socket, next));
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
    manageActivityRooms(socket);
  });
};

module.exports = {
  initSockets,
};
