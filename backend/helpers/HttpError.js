const ERROR_MESSAGES = Object.freeze({
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbbiden",
  404: "Not found",
  409: "Conflic",
});

module.exports = (code, message = ERROR_MESSAGES[code]) => {
  const error = new Error(message);
  error.code = code;
  return error;
};
