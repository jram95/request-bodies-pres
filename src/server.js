const express = require("express");
const dotenv = require("dotenv");
const {Client} = require("pg");

const app = express();
dotenv.config();

const config = {
  connectionString: process.env.DATABASE_URL,
};

// enable server to read body as JSON data
app.use(express.json());


// simple POST example
app.post("/comment", (req, res) => {
  console.log(req.body);
  res.json({
    message: "POST request successful"
  })
});

// complex POST example
// add body of request to comments database
// INSERT INTO table_name (COL1, ...) VALUES (VALUE1, ...);
app.post("/comment-sql", async (req, res) => {
  try {
  const {user_id, comment} = req.body;
  const client = new Client(config);
  console.log(client)
  await client.connect();
  const result = await client.query("insert into comments (user_id, comment) values ($1, $2)) returning *", 
  [user_id, comment]);
  await client.end();

  res.json(result.rows)
  }

  catch (err){
  console.error(err.message)
  }
})

const PORT = process.env.PORT_NUMBER ?? 4000;

app.listen(PORT, () => {
  console.log(`You are now listening on PORT ${PORT}`)
})