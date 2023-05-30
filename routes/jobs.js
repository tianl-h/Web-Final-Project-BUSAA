// create a new router object and require controller
const router = require("express").Router();
const jobController = require("../controllers/jobsController");

// Job routes
router.get("/", jobController.index, jobController.indexView);
router.get("/new", jobController.auth, jobController.new);
router.post("/create", jobController.auth, jobController.validate, jobController.create, jobController.redirectView);
router.get("/:id", jobController.show);
router.get("/:id/edit", jobController.auth, jobController.edit);
router.put("/:id/update", jobController.auth, jobController.validate, jobController.update, jobController.redirectView);
router.delete("/:id/delete", jobController.auth, jobController.delete, jobController.redirectView);

module.exports = router;