// Require the express module and create a new router object
const contactRouter = require("express").Router();
// Require the contact controller
const contactController = require("../controllers/contactController");

// Handle GET requests to the root path of the contact section
contactRouter.get("/", contactController.index);

// Handle POST requests to the root path of the contact section
contactRouter.post(
    "/",
    contactController.validateContact,
    contactController.addContact
);

// Handle GET requests to the '/index' path of the contact section
contactRouter.get("/index", contactController.auth, contactController.getAll);

// Handle DELETE requests to the root path of the contact section with an ID parameter
contactRouter.delete(
    "/:id",
    contactController.auth,
    contactController.deleteContact
);

// Export the router object
module.exports = contactRouter;
