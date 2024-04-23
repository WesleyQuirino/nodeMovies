const AppError = require("../utils/AppError");
const sqliteConection = require("../database/sqlite");
const DiskStorage = require("../provider/DiskStorage");

class UsersAvatarController{
    async update( request, response ){
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;
        const diskStorage = new DiskStorage();

        const database = await sqliteConection();

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

        if( !user ){
            throw new AppError("Somente usúarios autenticados podem alterar a foto de perfil", 401);
        }

        if( user.avatar ){
            await diskStorage.deleteFile( user.avatar );
        }

        const filename = await diskStorage.saveFile( avatarFilename );
        user.avatar = filename;

        await database.get("UPDATE users SET avatar = (?) WHERE id = (?)", [user.avatar, user_id] );
        
        return response.json(user);
    }
}

module.exports = UsersAvatarController;