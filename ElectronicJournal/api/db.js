import mysql from "mysql2";

export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "5189",
    database: "electronic_journal"
});

db.connect((err) => {
    if(err) console.log("DB connection failed!");
    else console.log("DB connected!");
})
