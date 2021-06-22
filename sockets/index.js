// const { CORS_ALLOWED_ORIGINS } = require('../env');
// const sessions = require('../middlewares/sessions');
// const User = require('../models/user');
// const { manageActivityRooms } = require('./activityRooms');

const initSockets = (server) => {
  console.log(server);
  // TODO: instanciate socket server with cors/origin and cors/withCredentials

  // setup middlewares to authenticate every ws request : io.use((socket, next) => sessions(...))
  // in another middleware : get currentUser from socket.request.session.userId. otherwise disconnect the socket

  // handle connect
};

module.exports = {
  initSockets,
};
