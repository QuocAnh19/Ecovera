import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dataBase = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || process.env.DB_DATABASE || "ecovera_db",
  waitForConnections: true,
  // connectionLimit: parseInt.env.DB_CONNECTION_LIMIT,
  queueLimit: 0,
});

console.log("==== MySQL pool initialized (waiting for connections) ====");

const db = dataBase.promise();

export default db;
