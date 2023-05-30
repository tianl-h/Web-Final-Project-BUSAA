// Require the Contact model
const Contact = require("../models/contact");

// Define an object with several methods to handle contact messages
module.exports = {
    // Validate required program fields
    validateContact: (req, res, next) => {
        req.check("name").notEmpty().withMessage("Name is required");
        req.check("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid");
        req.check("title").notEmpty().withMessage("Title is required");
        req.check("issue").notEmpty().withMessage("Message is required");

        req.getValidationResult().then((errors) => {
            if (!errors.isEmpty()) {
                let messages = errors.array().map((e) => e.msg);
                req.flash("error", messages.join(" and "));
                res.redirect("/contact");
            } else {
                next();
            }
        });
    },

    // Add the contact message to the database
    addContact: (req, res) => {
        const newContact = new Contact(req.body);
        newContact
            .save()
            .then((savedContact) => {
                req.flash("success", "Message sent!");
                res.redirect("./");
            })
            .catch(() => {
                req.flash("error", "Fail to send message");
                res.redirect("/contact");
            });
    },

    // Render the contact page
    index: (req, res) => {
        const user = req.user;
        res.render("contact", { user });
    },

    // Get all messages from the database and retrieve needed information
    getAll: (req, res) => {
        const user = req.user;
        Contact.find({}, "name email title issue")
            .then((contacts) => {
                res.render("contactindex", { contacts, user });
            })
            .catch((err) => {
                req.flash("error", "Fail to list contact messages");
                res.redirect("./");
            });
    },

    // Delete a contact message from the database
    deleteContact: (req, res) => {
        Contact.deleteOne({ _id: req.params.id })
            .then(() => {
                req.flash("success", "Contact message successfully deleted");
                res.redirect(".");
            })
            .catch(() => {
                req.flash("error", "Fail to delete contact message");
                res.redirect("./");
            });
    },

    // Middleware function to check if the user is authenticated and an admin
    auth: (req, res, next) => {
        if (req.isAuthenticated()) {
            if (req.user.isAdmin) {
                return next();
            } else {
                req.flash("error", "You must be an admin to access this page.");
                res.redirect("/facilities");
            }
        } else {
            req.flash("error", "You must be logged in to access this page.");
            res.redirect("/users/login");
        }
    },
};
