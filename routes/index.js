
// This code defines a router that handles requests related to route index using the Express framework.
const router = require("express").Router();
const aboutRouter = require("./about")
const errorRouter = require("./error")
const eventsRouter = require("./events");
const homeRouter = require("./home");
const jobsRouter = require("./jobs");
const usersRouter = require("./users");
const contactRouter = require("./contact");
const apiRoutes = require("./apiRoutes");

// Use routers for different parts of the application
router.use("/users", usersRouter);
router.use("/about", aboutRouter);
router.use("/events", eventsRouter);
router.use("/jobs", jobsRouter);
router.use("/contact", contactRouter);
router.use("/", homeRouter);
router.use("/api", apiRoutes);
router.use("/error", errorRouter);

module.exports = router;
