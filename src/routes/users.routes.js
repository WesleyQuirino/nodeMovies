const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../config/upload");

const UserController = require("../controllers/UsersController");
const UsersAvatarController = require("../controllers/UsersAvatarController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const userController = new UserController();
const userAvatarController = new UsersAvatarController();

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

usersRoutes.post("/", userController.create);
usersRoutes.put("/", ensureAuthenticated, userController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);


module.exports = usersRoutes;