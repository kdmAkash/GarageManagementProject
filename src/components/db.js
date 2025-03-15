import mysql from 'mysql2/promise';


const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Update your MySQL username
  password: 'arkadam-123', // Update your MySQL password
  database: 'mydb', // Update with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
