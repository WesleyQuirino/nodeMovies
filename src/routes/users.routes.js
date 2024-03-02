const { Router } = require("express");

const UserController = require("../controllers/UsersController");

const userController = new UserController();

const usersRoutes = Router();

usersRoutes.post("/", userController.create);
usersRoutes.put("/:id", userController.update);

module.exports = usersRoutes;