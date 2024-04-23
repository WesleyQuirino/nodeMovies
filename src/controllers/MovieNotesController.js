const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController{
    async create(request, response){
        const { title, description, rating, tags } = request.body;
        const user_id = request.user.id;

        if(!title){
            throw new AppError("O titulo do filme é obrigatório!");
        };

        if(!rating){
            throw new AppError("O nota do filme é obrigatória!");
        };

        if(rating > 5 || rating < 0){
            throw new AppError("O nota do filme deve ser maior ou igual 0 e menor ou igual a 5!");
        }

        const [note_id] = await knex("movie_notes").insert({
            title,
            description,
            rating,
            user_id
        })

        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        })

        await knex("movie_tags").insert(tagsInsert);

        return response.status(200).json();
    };

    async index(request, response) {
        const { title, tags } = request.query;
        const user_id = request.user.id;
    
        let movieNotes;
    
        if (tags) {
            const filterTags = tags.split(",").map(tag => tag.trim());
    
            movieNotes = await knex("movie_tags")
                .select(["movie_notes.id", "movie_notes.title", "movie_notes.description", "movie_notes.rating", "movie_notes.user_id"])
                .where("movie_notes.user_id", user_id)
                .whereLike("movie_notes.title", `%${title}%`)
                .whereIn("movie_tags.name", filterTags)
                .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
                .orderBy("movie_notes.title");
        } else {
            movieNotes = await knex("movie_notes")
                .select(["id", "title", "description", "rating", "user_id"])
                .where("user_id", user_id)
                .whereLike("title", `%${title}%`)
                .orderBy("title");
        }
    
        const userTags = await knex("movie_tags").where({ user_id });
    
        const notesWithTags = movieNotes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);
            return {
                ...note,
                tags: noteTags
            };
        });
    
        return response.json(notesWithTags);
    };

    async show(request, response){
        const {id} = request.params;

        const movieNotes = await knex("movie_notes").where({id}).first();
        const tagNotes = await knex("movie_tags").where({note_id: id}).orderBy("name");

        return response.json({
            ...movieNotes,
            tagNotes
        })
    };

    async delete(request, response){
        const {id} = request.params;

        await knex("movie_notes").where({id}).delete();

        return response.json();

    }
}


module.exports = MovieNotesController;