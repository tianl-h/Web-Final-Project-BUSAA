
//initializes the database with a set of default events if no jobs are found. 
const Job = require('./models/job'); 

const jobs = [
  {
    title: "Software Engineer",
    company: "Tech Company A",
    location: "Boston, MA",
    description: "Develop, maintain, and optimize our software products. Collaborate with cross-functional teams to deliver high-quality code that meets specifications.",
    requirements: "Bachelor's degree in Computer Science or related field. 2+ years of experience in software development. Proficiency in JavaScript, Python, or Java. Knowledge of software development principles.",
    salary: 90000,
    contactEmail: "hr@techcompanya.com",
    contactPhone: "555-555-5555",
    deadlineDate: new Date("2023-06-01"),
    isActive: true
  },
  {
    title: "Data Analyst",
    company: "Tech Company B",
    location: "Boston, MA",
    description: "Analyze large datasets, develop key insights and deliver reports to stakeholders. Utilize data to optimize business operations and strategy.",
    requirements: "Bachelor's degree in a quantitative field. Proficiency in SQL and Excel. Strong analytical and problem-solving skills.",
    salary: 80000,
    contactEmail: "hr@techcompanyb.com",
    contactPhone: "555-555-5556",
    deadlineDate: new Date("2023-06-15"),
    isActive: true
  },
  {
    title: "Product Manager",
    company: "Tech Company C",
    location: "Boston, MA",
    description: "Lead the product development process. Collaborate with cross-functional teams to deliver high-quality products that meet market needs.",
    requirements: "Bachelor's degree in a related field. 3+ years of experience in product management. Strong communication and leadership skills.",
    salary: 110000,
    contactEmail: "hr@techcompanyc.com",
    contactPhone: "555-555-5557",
    deadlineDate: new Date("2023-07-01"),
    isActive: true
  },
];

async function initializeJobs() {
  try {
    const count = await Job.countDocuments();

    if (count === 0) {
      console.log('No jobs found, initializing default jobs...');
      await Job.insertMany(jobs);
      console.log('Default jobs initialized successfully.');
    } else {
      console.log('Jobs already exist, skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing jobs:', error);
  }
}

module.exports = initializeJobs;
