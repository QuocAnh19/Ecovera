import mysql from "mysql2/promise";

const dataBase = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "191006",
  database: "ecovera",
});

dataBase.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

export default dataBase;
