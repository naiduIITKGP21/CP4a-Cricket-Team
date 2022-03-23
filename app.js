//starting the express JS server
const express = require("express");
const app = express();
const { open } = require("sqlite"); //Importing from sqlite package
const path = require("path"); //importing core module path

//connecting SQLite database
const dbPath = path.join(__dirname, "cricketTeam.db"); //path of database
const sqlite3 = require("sqlite3"); // importing sqlite3 database
app.use(express.json());

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log("DB Error: ${e.message}");
    process.exit(1);
  }
};

initializeDBAndServer();
const convertJsonObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//API 1 : Returns a list of all players in the team
app.get("/players/", async (request, response) => {
  const getAllPlayersOfTeam = `SELECT * FROM cricket_team;`;
  const playersArray = await db.all(getAllPlayersOfTeam);
  console.log(playersArray);
  response.send(
    playersArray.map((eachPlayer) => {
      return convertJsonObjectToResponseObject(eachPlayer);
    })
  );
});
