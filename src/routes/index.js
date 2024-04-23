const { Router } = require("express");

const userRouter = require("./users.routes");
const sessionsRouter = require("./sessions.routes");
const movieNotesRouter = require("./movieNotes.routes");

const routes = Router();
routes.use("/users", userRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/movieNotes", movieNotesRouter);

module.exports = routes;