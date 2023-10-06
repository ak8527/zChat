import log from 'npmlog';

const errorHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMessage = err.message || 'Internal Server Error';
  log.error('ErrorHandler:', errStatus, errMessage);
  return res.status(errStatus).json({
    error: true,
    data: {
      status: errStatus || 500,
      message: errMessage,
      stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    },
  });
};

export default errorHandler;
