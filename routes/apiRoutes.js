// This code defines a router using the Express framework.
const express = require("express");
const router = express.Router();
// Import the eventsController and usersController modules.
const eventsController = require("../controllers/eventsController");
const usersController = require("../controllers/usersController");

// Define the first route, which responds to GET requests to the "/events" endpoint.
router.get("/events", eventsController.index, eventsController.respondJSON);
// Use the verifyToken function from usersController as middleware to ensure the user is authenticated.
router.use(usersController.verifyToken);
// Define the second route, which responds to GET requests to the "/events/:id/attend" endpoint.
router.get("/events/:id/attend", eventsController.isAuth, eventsController.attend, eventsController.respondJSON);
// Use the errorJSON function from eventsController as middleware to handle errors that occur during request processing.
router.use(eventsController.errorJSON);
// Export the router for use in other parts of the application.
module.exports = router;

