const ActivityParticipation = require('../models/activityParticipation');
const User = require('../models/user');
const { activityEventEmitter } = require('../models/activity');

const manageActivityRooms = (socket) => {
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

    const handleUpdate = (updated) => {
      socket.emit('activityUpdated', updated);
    };
    activityEventEmitter.on('activityUpdated', handleUpdate);

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
        energyLevel: activityParticipation.energyLevel,
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
      activityEventEmitter.off('activityUpdated', handleUpdate);
      await ActivityParticipation.leaveActivity(userId, activityId);
      socket.to(room).emit('userLeft', userId);
    });
  });
};

module.exports = {
  manageActivityRooms,
};
