import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import { getBreed } from "./utils/getBreed";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/", async (req, res) => {
  const dbres = await client.query("select * from leaderboard");
  res.json(dbres.rows);
});

app.get("/dogs/random", async (req, res) => {
  try {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");

    const imgUrl: string = response.data.message;
    let [unformattedBreed, breed] = getBreed(imgUrl);
    let data = {
      url: imgUrl,
      breed: breed,
      unformattedBreed: unformattedBreed,
    };
    const createDog = await client.query(
      "INSERT INTO leaderboard (breed, url_breed) VALUES($1, $2) ON CONFLICT (breed) DO NOTHING",
      [data.breed, data.unformattedBreed]
    );
    res.json(data);
  } catch (err) {
    console.error(err.message);
  }
});

app.put("/dogs/addvote", async (req, res) => {
  const { breed } = req.body;
  const result = await client.query(
    "UPDATE leaderboard SET votes = (votes + 1) WHERE breed = $1",
    [breed]
  );
  res.json(result.rows);
});

app.get("/leaderboard", async (req, res) => {
  const dbres = await client.query(
    "SELECT * FROM leaderboard ORDER BY votes DESC LIMIT 10"
  );
  res.status(200).json({
    status: "success",
    data: dbres.rows,
  });
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
