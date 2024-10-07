const statusCode = require('../enums/httpStatus');

module.exports.create = function (logger) {
  logger = logger ?? console;
  return function (err, req, res, next) {
      let errorName = 'unknown';

      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
          errorName = 'alreadyExists';
      }

      const { code, codeNo, message } = statusCode[errorName];
      let httpStatus = statusCode[errorName].httpStatus;
      const errorRes = {
          code,
          codeNo,
          message
      };
      try {
          // set locals, only providing error in development
          if (err?.name && err?.name !== 'Error') {
              const errName = err.name.replace('Error', '');
              const errParam = errName.charAt(0).toLowerCase() + errName.slice(1);
              if (statusCode[errParam]) {
                  errorRes.code = statusCode[errParam].code;
                  errorRes.codeNo = statusCode[errParam].codeNo;
                  errorRes.message = statusCode[errParam].message;
                  httpStatus = statusCode[errParam].httpStatus;
              }
          }

          // if in development, response more detail
          if (req.app.get('env') === 'development') {
              errorRes.message = err.Message || err.message;
              errorRes.stack = err.stack;
          }
          if (req.uuid) {
              errorRes.uuid = req.uuid;
          }
          logger.error({
              uuid: req.uuid,
              url: req.url,
              stack: err.stack
          });
      } catch (error) {
      }
      // response the error
      res.status(httpStatus).json(errorRes);
  };
};
