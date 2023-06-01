const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  dateStrings: "date",
});

const connection = pool.promise();

connection
  .query("SELECT 1")
  .then(([rows, fields]) => {
    console.log("MySQL is running...");
  })
  .catch((err) => {
    console.log(err);
  });

export default connection;
