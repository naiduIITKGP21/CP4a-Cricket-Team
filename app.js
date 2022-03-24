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
  console.log("Returned list of all players");
});

//API 2 : Creates a new player in the team (database)
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `INSERT INTO cricket_team
(player_name, jersey_number, role)
VALUES
("${playerName}", "${jerseyNumber}", "${role}");`;

  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
  console.log("Player is added to the Team");
});

//API 3 : Returns a player based on a player ID
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT * FROM cricket_team WHERE player_id=${playerId}`;
  const playerDetails = await db.get(getPlayerQuery);
  response.send({
    playerId: playerDetails.player_id,
    playerName: playerDetails.player_name,
    jerseyNumber: playerDetails.jersey_number,
    role: playerDetails.role,
  });
  console.log(`playerID ${playerId} details are successfully  returned`);
});

//API 4 : Updates the details of a player in the team (database) based on the player ID
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updateplayerDetailsQuery = `UPDATE cricket_team 
  SET
  player_name = "${playerName}",
  jersey_number = ${jerseyNumber},
  role = "${role}"
  WHERE player_id = ${playerId};`;

  await db.run(updateplayerDetailsQuery);
  response.send("Player Details Updated");
  console.log("Player Details Updated");
});

//API 5 : Deletes a player from the team (database) based on the player ID
app.delete("/players/:playerId/", (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;

  db.run(deletePlayerQuery);
  response.send("Player Removed");
  console.log(`Player Removed based on player_id ${playerId}`);
});
