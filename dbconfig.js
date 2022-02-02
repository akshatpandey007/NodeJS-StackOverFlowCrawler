import mysql from "mysql";

const db = mysql.createConnection({
  host: "127.0.0.1",
  port: "3333",
  user: "root",
  password: "password",
  database: "stackoverflowcrawler",
});

db.connect();

export default db;
