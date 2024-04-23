const { Router } = require("express");

const MovieNotesController = require("../controllers/MovieNotesController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");

const movieNotesRoutes = Router();

const movieNotes = new MovieNotesController();

movieNotesRoutes.use(ensureAuthenticated);

movieNotesRoutes.get("/", movieNotes.index);
movieNotesRoutes.post("/", movieNotes.create);
movieNotesRoutes.get("/:id", movieNotes.show);
movieNotesRoutes.delete("/:id", movieNotes.delete);


module.exports = movieNotesRoutes;