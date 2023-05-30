// Create a router for handling requests to the about page
const contactRouter = require("express").Router();
const contactController = require("../controllers/contactController");

// Handle GET requests to the about page
contactRouter.get("/", contactController.index);

module.exports = contactRouter;