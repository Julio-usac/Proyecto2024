require('dotenv').config();
var dbconnection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

module.exports = {
    dbconnection: dbconnection
};