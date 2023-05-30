// This code defines a Mongoose schema for users and exports a model for it
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require("rand-token");

// Defines the user schema with properties name, email, password, role, graduationYear, major, job, company, city, state, country, zipCode, bio, and interests
const userSchema = mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    isAdmin: { 
      type: Boolean, 
      default: false 
    },
    role: { 
        type: String, 
        enum: ['student', 'alumni'], 
        default: 'student' 
    },
    graduationYear: { 
        type: Number, 
        required: true
    },
    major: { 
        type: String, 
        required: true 
    },
    job: { type: String },
    company: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { 
        type: Number, min: 10000, max: 99999 
    },
    bio: { type: String },
    interests: [{ type: String }],
    apiToken: {
      type: String,
    },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Events" }],
  },
  {
    timestamps: true,
  },
);

// Define a virtual property that returns the user's full name
userSchema.virtual("fullName").get(function () {
  return `${this.name}`;
});

// Add passportLocalMongoose plugin to the user schema to handle password hashing and salting
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// Middleware that generates an API token for the user if it does not exist
userSchema.pre("save", function (next) {
  let user = this;
  if (!user.apiToken) user.apiToken = randToken.generate(16);
  next();
});

// Exports the user model
module.exports = mongoose.model("User", userSchema);
