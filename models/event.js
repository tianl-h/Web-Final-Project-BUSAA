// This code defines a Mongoose schema for events and exports a model for it
const mongoose = require("mongoose");
// Defines the events schema with properties title, description, location, startDate, endDate, isOnline, registrationLink, organizer, and attendees
const eventsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  registrationLink: {
    type: String,
  },
  organizer: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User',
    required: true,
  },
  attendees: [{
    type: mongoose.Schema.ObjectId, 
    ref: 'User',
  }],
});
// Exports the events model
module.exports = mongoose.model("Events", eventsSchema);
