// Require the Mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Define the contact schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    issue: { type: String, required: true },
});

// Export the contact model created from the schema
module.exports = mongoose.model("Contact", contactSchema);
