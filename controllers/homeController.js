const Event = require("../models/event");
const Job = require("../models/job");
// Define the homeController object
const homeController = {
  index: async (req, res) => {
      try {
          const jobs = await Job.find({});
          const events = await Event.find({});
          res.render("home", { events, jobs });
      } catch (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
      }
      
  },
  chat: (req, res) => {
      res.render("chat");
    },
  };
  
// Export the homeController object so it can be used by other modules
module.exports = homeController;
