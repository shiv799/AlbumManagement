const mysql = require("mysql");

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_UID,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Use the connection pool for querying
const connection = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        connection.query(query, params, (error, results) => {
          connection.release();
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      }
    });
  });
};

module.exports = connection;
