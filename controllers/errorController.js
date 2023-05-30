// Importing the 'http-status-codes' package to use its predefined status codes.
const httpStatus = require("http-status-codes");

// Middleware function that handles page not found (HTTP error 404).
exports.pageNotFoundError = (req, res) => {
  // Setting the 'NOT_FOUND' status code as the error code.
  let errorCode = httpStatus.NOT_FOUND;
  
  // Setting the response status to the error code.
  res.status(errorCode);
  
  // Rendering an error view and passing the status code as a parameter.
  res.render("error", { statusCode: errorCode });
};

// Middleware function that handles internal server errors (HTTP error 500).
exports.internalServerError = (error, req, res, next) => {
  // Setting the 'INTERNAL_SERVER_ERROR' status code as the error code.
  let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
  
  // Logging the error stack trace to the console.
  console.log(`ERROR occurred: ${error.stack}`);
  
  // Setting the response status to the error code.
  res.status(errorCode);
  
  // Sending a generic error message to the client.
  res.send(`${errorCode} | Sorry, our application is taking a nap!`);
};
