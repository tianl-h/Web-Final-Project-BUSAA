//initializes the database with a set of default events if no events are found. 
const User = require('./models/user'); 
const Event = require('./models/event'); 

const eventsData = [
  {
    title: "BUSAA Annual Meeting",
    description: "Join us for the annual BUSAA meeting. We will discuss our achievements of the past year and our plans for the future.",
    location: "Brandeis University, Levin Ballroom",
    startDate: new Date("2023-05-10T09:00:00"),
    endDate: new Date("2023-05-10T12:00:00"),
    isOnline: false,
    registrationLink: "http://www.busaa.com/annual-meeting",
    attendees: []
  },
  {
    title: "Alumni Networking Event",
    description: "This event provides a platform for alumni to connect, share their experiences and build professional networks.",
    location: "Online via Zoom",
    startDate: new Date("2023-06-15T16:00:00"),
    endDate: new Date("2023-06-15T18:00:00"),
    isOnline: true,
    registrationLink: "http://www.busaa.com/alumni-networking",
    attendees: []
  },
  {
    title: "Fundraising for Scholarships",
    description: "Help us raise funds for scholarships to support current and future Brandeis students. Every contribution, big or small, can make a difference!",
    location: "Brandeis University, Sherman Function Hall",
    startDate: new Date("2023-07-10T10:00:00"),
    endDate: new Date("2023-07-10T14:00:00"),
    isOnline: false,
    registrationLink: "http://www.busaa.com/fundraising-event",
    attendees: []
  },
];

async function initializeEvents() {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      console.log('No events found, initializing default events...');

      // Fetch the admin user
      const adminUser = await User.findOne({ isAdmin: true });
      if (!adminUser) {
        console.error("Admin user not found. Please ensure the admin user exists in the database.");
        return;
      }

      // Map through the events and set the organizer field to the admin user's ObjectId
      const events = eventsData.map((event) => ({
        ...event,
        organizer: adminUser._id,
      }));

      await Event.insertMany(events);
      console.log('Default events initialized successfully.');
    } else {
      console.log('Events already exist, skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing events:', error);
  }
}

module.exports = initializeEvents;
