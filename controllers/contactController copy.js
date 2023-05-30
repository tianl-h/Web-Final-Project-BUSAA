// Define the contactController object
const contactController = {
    // Define the index method for the contactController
    index: (req, res) => {
      const user = res.locals.user; // get user from res.locals
      res.render('contact', { user });
    }
  };

// Export the contactController object so it can be used by other modules
module.exports = contactController;