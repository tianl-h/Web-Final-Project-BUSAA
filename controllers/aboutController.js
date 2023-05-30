// Define the aboutController object
const aboutController = {
  // Define the index method for the aboutController
  index: (req, res) => {
    const user = res.locals.user; // get user from res.locals
    res.render('about', { user });
  }
};

// Export the aboutController object so it can be used by other modules
module.exports = aboutController;
