// This code defines a Mongoose schema for job postings and exports a model for it
const mongoose = require("mongoose");
// Defines the job schema with properties title, company, location, description, requirements, salary, contactEmail, contactPhone, postDate, deadlineDate, isActive, and creator
const jobSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date, 
    default: Date.now
  },
  deadlineDate: {
    type: Date, 
    required: true
  },
  isActive: {
    type: Boolean, 
    default: true
  }
});
// Exports the job model
module.exports = mongoose.model("Job", jobSchema);
