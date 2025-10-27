import mysql from "mysql2";

const dataBase = mysql.createConnection({
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
