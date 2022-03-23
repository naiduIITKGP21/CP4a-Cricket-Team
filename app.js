//starting the express JS server
const express = require("express");
const app = express();
const { open } = require("sqlite"); //Importing from sqlite package
const path = require("path"); //importing core module path

//connecting SQLite database
const dbPath = path.join(__dirname, "cricketTeam.db"); //path of database
const sqlite3 = require("sqlite3"); // importing sqlite3 database
const initializeDBAndServer = async () => {
  await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000),
    () => {
      console.log("server Running at http://localhost:3000/");
    };
};
initializeDBAndServer();
