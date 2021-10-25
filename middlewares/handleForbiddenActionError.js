const { ForbiddenActionError } = require('../error-types');

// eslint-disable-next-line
module.exports = (error, req, res, next) => {
  if (error instanceof ForbiddenActionError)
    return res.status(403).send({
      errorMessage: error.message,
      ...error,
    });
  return next(error);
};
