// routers for users
const usersRouter = require("express").Router();
// Imports user controller module
const usersController = require("../controllers/usersController");

// Handles GET request to "/users" path and renders user index view
usersRouter.get("/", usersController.index, usersController.indexView);
// Handles GET request to "/users/new" path and renders user new form
usersRouter.get("/new", usersController.new);
// Handles POST request to "/users/create" path and creates a new user
usersRouter.post("/create", usersController.validateUser, usersController.create, usersController.redirectView);
// Handles GET request to "/users/login" path and renders user login form
usersRouter.get("/login", usersController.login);
// Handles POST request to "/users/login" path and authenticates user
usersRouter.post("/login", usersController.authenticate, usersController.redirectView);
// Handles GET request to "/users/logout" path and logs out user
usersRouter.get("/logout", usersController.logout, usersController.redirectView); 
// Handles GET request to "/users/edit/:id" path and renders user edit form
usersRouter.get("/edit/:id", usersController.editUser);
// Handles GET request to "/users/:id" path and shows user detail
usersRouter.get("/:id", usersController.showUser);
// Handles GET request to "/users/:id/edit" path and renders user edit form
usersRouter.get("/:id/edit", usersController.editUser);
// Handles PUT request to "/users/:id/update" path and updates user
usersRouter.put("/:id/update", usersController.validateUser, usersController.updateUser, usersController.redirectView);
// Handles DELETE request to "/users/:id/delete" path and deletes user
usersRouter.delete("/:id/delete", usersController.deleteUser, usersController.redirectView); 

module.exports = usersRouter;


