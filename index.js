// Import necessary modules
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const expressValidator = require("express-validator");
const User = require("./models/user");
const socketio = require("socket.io");
const chatController = require("./controllers/chatController");
const router = require("./routes/index");

// Initialize facilities and events data
const initializeJobs = require("./initializeJobs");
const initializeEvents = require("./initializeEvents");

// Connect to the MongoDB database named brandeis_saa
mongoose.connect("mongodb://localhost:27017/brandeis_saa");
// Set up a connection to the MongoDB database
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB!");
});
// Set the view engine to EJS
app.set('view engine', 'ejs');
// Serve static files from the public directory
app.use(express.static('public'));
// Set up EJS layouts
app.use(layouts);
// Override HTTP methods to support DELETE and PUT methods
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Set up view engine and middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(expressValidator());

// Use cookie-parser to parse cookies in the request headers
app.use(cookieParser("secret-pascode"));
// Use express-session to create a session middleware
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 40000,
    },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Use passport for user authentication
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, {
          message: "Failed to log in user account: User account not found.",
        });
      }
      user.authenticate(password, (err, result) => {
        if (err) return done(err);
        if (!result) {
          return done(null, false, {
            message: "Failed to log in user account: Incorrect Password.",
          });
        }
        return done(null, user);
      });
    } catch (err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Create a middleware that is called on every request
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  // console.log('req.isAuthenticated():', req.isAuthenticated());
  // console.log('req.user:', req.user);
  // console.log('res.locals:', res.locals);
  next();
});

// Use the router to handle all requests
app.use("/", router);

// Create an admin user if one does not exist
async function createAdminUser() {
  try {
    const adminUserExists = await User.findOne({ isAdmin: true });

    if (!adminUserExists) {
        const adminUser = new User({
            name: "Admin",
            email: "admin@example.com",
            isAdmin: true,
            role: 'alumni', // Set the role. 
            graduationYear: 2023, // Set the graduationYear.
            major: 'Computer Science', // Set the major. 
            city: 'San Francisco', // Set the city. 
            state: 'California', // Set the state. 
            country: 'USA', // Set the country. 
            zipCode: 94101, // Set the zipCode. 
        });

        await User.register(adminUser, "12345"); // 12345 is the default password
        console.log("Admin user created:", adminUser);
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Start the server
const server = app.listen(8080, async () => {
  console.log('Server listening on port 8080');
  await createAdminUser(); // Make sure to create the admin user first.
  
  // initialize jobs and events.
  initializeJobs();
  initializeEvents();
  // initializes a socket.io instance and calls the chatController function to handle socket events related to the chat feature of the application.
  const io = socketio(server);
  chatController(io);
});
