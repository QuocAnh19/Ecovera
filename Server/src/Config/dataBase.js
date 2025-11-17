import mysql from "mysql2";

const dataBase = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "191006",
  database: "ecovera",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("✅ MySQL pool initialized (waiting for connections)");

export default dataBase;
