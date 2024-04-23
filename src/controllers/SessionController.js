const sqliteConection = require("../database/sqlite");
const AppError = require("../utils/AppError");

const authConfig = require("../config/auth");
const { sign } = require("jsonwebtoken");
const { compare } = require("bcryptjs");


class SessionController{
    async create( request, response ){
        const { email, password } = request.body;
        const database = await sqliteConection();
        
        const user = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        let checkPassword;
        
        if( user ){
            checkPassword = await compare( password, user.password );
        } else{
            throw new AppError("Email ou senha incorretos", 401);
        }

        if( !checkPassword || !user ){
            throw new AppError("Email ou senha incorretos", 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

        return response.json({ user, token });
    }
}

module.exports = SessionController;