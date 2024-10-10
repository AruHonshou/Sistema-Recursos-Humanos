// config/db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'chancho88XD',
    database: 'fundacioncentrovrai',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;
