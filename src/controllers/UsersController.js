const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConection = require("../database/sqlite");
const { query } = require("express");

class UsersController {

    async create( request, response ){
        const { name, email, password } = request.body;

        const database = await sqliteConection();

        const checkUserExists = await database.get( "SELECT * FROM users WHERE email = (?)", [ email ] );

        const hashedPassword = await hash( password, 8 );

        if( checkUserExists ){
            throw new AppError( "Este e-mail já foi cadastrado" );
        } else {
            await database.run( "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword] );
        }

        return response.status(201).json();
    }

    async update( request, response ){
        const { name, email, password, oldPassword } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConection();
        const user = await database.get( "SELECT * FROM users WHERE id = (?)", user_id );

        const checkUserEmail = await database.get( "SELECT * FROM users WHERE email = (?)", [ email ] );

        if( !user ) {
            throw new AppError("Usúario não encontrado!")
        };

        if( checkUserEmail && checkUserEmail.id !== user.id ){
            throw new AppError("Usúario não encontrado!");
        };

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if( password && !oldPassword ){
            throw new AppError("Informe a senha atual!");
        };
        
        if( password && oldPassword ){

            const checkOldPassword = await compare(oldPassword, user.password);
            
            if(!checkOldPassword){
                throw new AppError( "As senhas devem ser iguais" );
            }
            
            user.password = await hash(password, 8); 
        };

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME("now")
            WHERE id = ?`,
            [ user.name, user.email, user.password, user_id]
        );
        console.log(user);
        return response.status(200).json();
    }
}

module.exports = UsersController;