const { Router } = require("express");

const MovieNotesController = require("../controllers/MovieNotesController");

const movieNotes = new MovieNotesController();

const movieNotesRoutes = Router();

movieNotesRoutes.get("/", movieNotes.index);
movieNotesRoutes.post("/:user_id", movieNotes.create);
movieNotesRoutes.get("/:id", movieNotes.show);
movieNotesRoutes.delete("/:id", movieNotes.delete);


module.exports = movieNotesRoutes;