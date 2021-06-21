const db = require('../db');

const joinActivity = (userId, activityId) => {
  const pk = {
    activityId: parseInt(activityId, 10),
    userId: parseInt(userId, 10),
  };
  const data = {
    ...pk,
    connected: true,
  };

  return db.activityParticipation.upsert({
    where: {
      userId_activityId: pk,
    },
    update: data,
    create: data,
  });
};

const leaveActivity = (userId, activityId) => {
  const pk = {
    activityId: parseInt(activityId, 10),
    userId: parseInt(userId, 10),
  };
  const data = {
    ...pk,
    connected: false,
  };

  return db.activityParticipation.upsert({
    where: {
      userId_activityId: pk,
    },
    update: data,
    create: data,
  });
};

const getConnectedUsers = (activityId) =>
  db.activityParticipation
    .findMany({
      where: {
        activityId: parseInt(activityId, 10),
        connected: true,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            meetUrl: true,
            discordId: true,
          },
        },
      },
    })
    .then((status) =>
      status.map(({ user, completionStatus, energyLevel }) => ({
        ...user,
        completionStatus,
        energyLevel,
      }))
    );

const update = ({ userId, activityId, completionStatus, energyLevel }) => {
  const pk = {
    activityId: parseInt(activityId, 10),
    userId: parseInt(userId, 10),
  };
  const data = {
    ...pk,
    completionStatus,
    energyLevel,
  };
  return db.activityParticipation.update({
    where: {
      userId_activityId: pk,
    },
    data,
  });
};

module.exports = {
  joinActivity,
  getConnectedUsers,
  leaveActivity,
  update,
};
