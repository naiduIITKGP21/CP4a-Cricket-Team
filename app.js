//starting the express JS server
const express = require("express");
const app = express();
const { open } = require("sqlite"); //Importing from sqlite package
const path = require("path"); //importing core module path

//connecting SQLite database
const dbPath = path.join(__dirname, "cricketTeam.db"); //path of database
const sqlite3 = require("sqlite3"); // importing sqlite3 database

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000),
      () => {
        console.log("server Running at http://localhost:3000/");
      };
  } catch (e) {
    console.log("DB Error:${e.message}");
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1 : Returns a list of all players in the team
app.get("/players/", async (request, resolve) => {
  const getAllPlayersOfTeam = `SELECT * FROM cricket_team;
    `;
  const playerArray = await db.all(getAllPlayersOfTeam);
});
