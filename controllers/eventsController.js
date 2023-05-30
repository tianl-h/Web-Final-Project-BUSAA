// Importing the Event and User models, as well as the check and validationResult functions from the express-validator package.
const Event = require("../models/event");
const User = require("../models/user");
const httpStatus = require("http-status-codes");

// Helper function to extract event parameters from request body
const getEventParams = (body) => {
  return {
    title: body.title,
    description: body.description,
    location: body.location,
    startDate: body.startDate,
    endDate: body.endDate,
    isOnline: body.isOnline === 'on',
    registrationLink: body.registrationLink,
  };
};

// Exporting an object with methods to handle events.
module.exports = {
  // validation middleware for the create and update events.
  validate: (req, res, next) => {
    req.check('title', 'Title cannot be empty').notEmpty();
    req.check('description', 'Description cannot be empty').notEmpty();
    req.check('location', 'Location cannot be empty').notEmpty();
    req.check('registrationLink')
      .optional()
      .isString()
      .withMessage('RegistrationLink should be string');
    req.check('startDate', 'Start date cannot be empty').notEmpty();
    req.check('endDate', 'End date cannot be empty').notEmpty();
  
    const errors = req.validationErrors();
    if (errors) {
      let messages = errors.map((e) => e.msg);
      req.flash('error', messages);
      res.redirect('/events/new');
    } else {
      next();
    }   
  },
  // List all events
  index: async (req, res, next) => {
    try {
      const events = await Event.find({}).populate("organizer");
      res.locals.events = events;
      res.locals.user = req.user; 
      next();
    } catch (error) {
      console.log(`Error fetching events: ${error.message}`);
      next(error);
    }
  },

  // Render events index view
  indexView: (req, res) => {
    res.render("events/index");
  },

  // Respond with a JSON object containing an OK status code and data from res.locals
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },
  
  // Respond with a JSON object containing an error status code and message
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },

 // Render new event form
  new: async (req, res, next) => {
    try {
      req.flash('success_msg', 'New event form loaded successfully!');
      res.render("events/new", { flashMessages: req.flash() });
    } catch (error) {
      console.log(`Error fetching users: ${error.message}`);
      next(error);
    }
  },

  // Create a new event
  create: [
    async (req, res, next) => {
      const errors = req.validationErrors();
    try {
      const eventParams = getEventParams(req.body);
    if (errors) {
      const users = await User.find({});
      const errorMessages = errors.array().map(error => error.msg);
      req.flash('error_msg', errorMessages);
      res.render("events/new", { errors: errorMessages, users, event: eventParams });
    } else {
        eventParams.organizer = req.user._id;
        const newEvent = new Event(eventParams);
        const event = await newEvent.save();
        req.flash("success_msg", "Event created successfully!");
        res.locals.redirect = "/events";
        next();
      }
    } catch (error) {
        console.log(`Error creating event: ${error.message}`);
        next(error);
      }
    }
  ],

  // Render event details view
  show: async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const event = await Event.findById(eventId)
        .populate("organizer")
        .populate("attendees");
      // console.log("event:", event);
      const events = await Event.find({});
      const user = req.user;
      if (event) {
        res.render("events/show", { event, events, user });
      } else {
        req.flash("error_msg", "Event not found.");
        res.locals.redirect = "/events";
        next();
      }
    } catch (error) {
      console.log(`Error fetching event by ID: ${error.message}`);
      next(error);
    }
  },  

  // Render event edit form
  edit: async (req, res, next) => {
    try {
      const eventId = req.params.id;
      const event = await Event.findById(eventId);

      if (event) {
        res.render("events/edit", { event });
      } else {
        req.flash("error", "Event not found.");
        res.redirect("/events");
      }
    } catch (error) {
      console.log(`Error fetching event by ID: ${error.message}`);
      req.flash("error", error.message);
      res.redirect("/events");
    }
  },

  // Update an event
  update: [
    async (req, res, next) => {
      const errors = req.validationErrors();
      try {
        const eventId = req.params.id;
        const eventParams = getEventParams(req.body);
        if (!errors) {
          const event = await Event.findById(eventId);
          if (!event) {
            req.flash("error", "Event not found.");
            res.locals.redirect = "/events";
            return next();
          }
          // Update event details
          await Event.findByIdAndUpdate(eventId, eventParams);
          req.flash("success", "Event updated successfully!");
          res.locals.redirect = `/events/${eventId}`;
          return next();
        } else {
          req.flash(
            "error",
            errors.array().map((error) => error.msg)
          );
          res.redirect(`/events/${eventId}/edit`);
        }
      } catch (error) {
        console.log(`Error updating event by ID: ${error.message}`);
        next(error);
      }
    }
  ],  
  
  // Delete an event
  delete: (req, res, next) => {
    let eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then(() => {
        req.flash("success", "Event deleted successfully!");
        res.locals.redirect = "/events";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting event by ID: ${error.message}`);
        req.flash("error", "Error deleting event.");
        next();
      });
  },  
  
  // Attend event
  attend: async (req, res, next) => {
    let eventId = req.params.id;
    let currentUser = req.user;
  
    try {
      let event = await Event.findById(eventId).populate("attendees").populate('organizer');
  
      if (!event) {
        req.flash("error_msg", "Event not found.");
        res.locals.redirect = "/events";
        return next();
      }
      
      if (!currentUser) {
        req.flash("error_msg", "You need to log in to join an event!");
        res.locals.redirect = `/events/${eventId}`;
        return next();
      }
      
      if (event.attendees.some(attendee => attendee._id.equals(currentUser._id))) {
        req.flash("error_msg", "You have already joined this event!");
        res.locals.redirect = `/events/${eventId}`;
        return next();
      }      
        
      if (currentUser._id.toString() === event.organizer._id.toString()) {
        req.flash("error_msg", "You are the event organizer and cannot attend your own event.");
        res.locals.redirect = `/events/${eventId}`;
        return next();
      }    
      
      await User.findByIdAndUpdate(currentUser._id, {
        $addToSet: { events: eventId },
      });

      res.locals.success = true;
      
      event.attendees.push(currentUser);
      await event.save();
  
      req.flash("success_msg", "You have successfully joined the event!");
  
      // Populate attendees and organizer
      event = await Event.findById(eventId).populate("attendees").populate('organizer');
  
      res.locals.redirect = `/events/${eventId}`;
      return next();
    } catch (error) {
      console.log(`Error attending event: ${error.message}`);
      req.flash("error_msg", "An error occurred while attending the event.");
      res.locals.redirect = `/events/${eventId}`;
      return next();
    }
  },  

  // Middleware function that checks if a redirect path is set 
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) {
      if (redirectPath === '/events') {
        // Redirect to the index view if the redirect path is /events
        res.redirect(redirectPath);
      } else {
        // Redirect to the show view of the event
        let eventId = req.params.id;
        if (eventId) {
          res.redirect(`/events/${eventId}`);
        } else {
          next();
        }
      }
    } else {
      next();
    }
  }, 

  // Middleware function to check if user is logged in
  isAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash("error", "You must be logged in to access this page.");
      res.redirect("/users/login");
    }
  },

  // Middleware function to check if user is an admin
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    } else {
      req.flash("error", "You must be an admin to access this page.");
      res.redirect("/events");
    }
  },
};

