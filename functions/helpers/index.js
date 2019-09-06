module.exports = {
  sendResponse: (response, statusCode, isError, errorMessage, data) => {
    response.status(statusCode).json({
      error: isError,
      errorMessage,
      data
    });
  }
};
