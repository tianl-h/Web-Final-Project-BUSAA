const Job = require("../models/job");

// Helper function to extract job parameters from request body
const getJobParams = (body) => {
  return {
    title: body.title,
    company: body.company,
    location: body.location,
    description: body.description,
    requirements: body.requirements,
    salary: body.salary,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone,
    deadlineDate: body.deadlineDate,
    isActive: body.isActive === "on" ? true : false,
  };
};

module.exports = {
  // validation middleware for the create and update jobs.
  validate: (req, res, next) => {
    req.check('title', 'Title cannot be empty').notEmpty();
    req.check("company", "Company cannot be empty").notEmpty();
    req.check('location', 'Location cannot be empty').notEmpty();
    req.check("description", "Description cannot be empty").notEmpty();
    req.check("requirements", "Requirements cannot be empty").notEmpty();
    req.check("salary", "Salary cannot be empty").notEmpty();
    req.check("contactEmail", "Contact email cannot be empty")
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email address");
    req.check("contactPhone", "Contact phone cannot be empty").notEmpty();
    req.check("deadlineDate", "Deadline date cannot be empty").notEmpty();
  
    const errors = req.validationErrors();
    if (errors) {
      let messages = errors.map((e) => e.msg);
      req.flash('error', messages);
      res.redirect('/jobs/new');
    } else {
      next();
    }   
  },
  // List all jobs
  index: async (req, res, next) => {
    try {
      const jobs = await Job.find({});
      const user = req.user;
      // res.locals.jobs = jobs;
      res.render('jobs', { jobs, user });
    } catch (error) {
      console.log(`Error fetching jobs: ${error.message}`);
      next(error);
    }
  },

  // Render jobs index view
  indexView: (req, res) => {
    res.render("jobs/index");
  },

  // Render new job form
  new: (req, res) => {
    const job = { isActive: false }; // Initialize job object with isActive set to false
    res.render("jobs/new", { job }); // Pass the job object to the view
  },

  // Create a new job
  create: [
    async (req, res, next) => {
      const errors = req.validationErrors();
      try {
        if (errors) {
          const errorMessages = errors.array().map(error => error.msg);
          req.flash("error", errorMessages);
          res.redirect("/jobs/new");
        } else {
          const jobParams = getJobParams(req.body);
          const newJob = new Job(jobParams);
          const job = await newJob.save();
          if (job) {
            req.flash("success", "Job created successfully!");
            res.redirect("/jobs");
          } else {
            req.flash("error", "Failed to create job.");
            res.redirect("/jobs/new");
          }
        }
      } catch (error) {
        console.log(`Error creating job: ${error.message}`);
        next(error);
      }
    }
  ],  
  
  // Render job details
  show: async (req, res, next) => {
    try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId);
      const jobs = await Job.find({});
      const user = req.user;

      if (job) {
        res.render("jobs/show", { job, jobs, user });
      } else {
        res.locals.redirect = "/jobs";
        next();
      }
    } catch (error) {
      console.log(`Error fetching job by ID: ${error.message}`);
      next(error);
    }
  },

  // Render job edit form
  edit: async (req, res, next) => {
    try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (job) {
        res.render("jobs/edit", { job });
      } else {
        res.locals.redirect = "/jobs";
        next();
      }
    } catch (error) {
      console.log(`Error fetching job by ID for edit: ${error.message}`);
      next(error);
    }
  },

  // Update a job
  update: [
    async (req, res, next) => {
      const errors = req.validationErrors();
      try {
        const jobId = req.params.id;
        const jobParams = getJobParams(req.body);
        if (!errors) {
          await Job.findByIdAndUpdate(jobId, { $set: jobParams });
          req.flash("success", "Job updated successfully!");
          res.redirect(`/jobs/${jobId}`);
        } else {
          const errorMessages = errors.array().map(error => error.msg);
          req.flash("error", errorMessages);
          res.redirect(`/jobs/${jobId}/edit`);
        }
      } catch (error) {
        console.log(`Error updating job by ID: ${error.message}`);
        next(error);
      }
    }
  ],

  // Middleware function that checks if a redirect path is set 
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },   

  // Delete a job
  delete: async (req, res, next) => {
    try {
    const jobId = req.params.id;
    await Job.findByIdAndRemove(jobId);
    req.flash("success", "Job deleted successfully!");
      res.locals.redirect = "/jobs";
      next();
    } catch (error) {
      console.log(`Error deleting job by ID: ${error.message}`);
      next(error);
    }
  },

  // Middleware function to check if user is logged in and an admin
  auth: (req, res, next) => {
    // Use Passport's isAuthenticated method to check if user is authenticated
    if (req.isAuthenticated()) {
      // Check if user is an admin
      if (req.user.isAdmin) {
        return next();
      } else {
        req.flash("error", "You must be an admin to access this page.");
        res.redirect("/jobs");
      }
    } else {
      req.flash("error", "You must be logged in to access this page.");
      res.redirect("/users/login");
    }
  },
};