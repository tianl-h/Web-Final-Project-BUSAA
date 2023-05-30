// create a new router object and require controller
const homeRouter = require("express").Router();
const homeController = require("../controllers/homeController");

// Define routes for the home page
homeRouter.get("/", homeController.index);
homeRouter.get("/chat", homeController.chat);

module.exports = homeRouter;
