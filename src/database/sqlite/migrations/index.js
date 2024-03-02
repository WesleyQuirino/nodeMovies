const sqliteConection = require("../../sqlite");

async function migrationsRun(){
    sqliteConection().catch(error => console.error(error));
};

module.exports = migrationsRun;