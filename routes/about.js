// Create a router for handling requests to the about page
const aboutRouter = require("express").Router();
const aboutController = require("../controllers/aboutController");

// Handle GET requests to the about page
aboutRouter.get("/", aboutController.index);

module.exports = aboutRouter;