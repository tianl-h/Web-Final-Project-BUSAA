// This code defines a router that handles requests related to events using the Express framework.
const router = require("express").Router();
const eventsController = require("../controllers/eventsController");

// Events routes
router.get("/", eventsController.index, eventsController.indexView);
router.get("/new", eventsController.isAdmin, eventsController.new);
router.post("/create", eventsController.isAdmin, eventsController.validate, eventsController.create, eventsController.redirectView);
router.get("/:id", eventsController.show);
router.get("/:id/edit", eventsController.isAdmin, eventsController.edit);
router.put("/:id/update", eventsController.isAdmin, eventsController.validate, eventsController.update, eventsController.redirectView);
router.delete("/:id/delete", eventsController.isAdmin, eventsController.delete, eventsController.redirectView);
router.post("/:id/attend", eventsController.isAuth, eventsController.attend, eventsController.redirectView);

module.exports = router;
