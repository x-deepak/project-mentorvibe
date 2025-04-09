
const path = require("node:path");
require('dotenv').config()

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());


const mongoose = require('mongoose');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const clientOptions = {
  serverApi: { version: '1', deprecationErrors: true }
};

async function run() {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

run().catch(console.dir);

//insert new data - comment this  after use --> [IMPORTANT]

// const insertData = require("./models/insertData");
// insertData();


const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));


app.get("/", (req, res) => {
  res.send("Hello World - Express Server");
});



const searchRouter = require("./routes/searchRouter");
app.use("/mentor", searchRouter);



// Every thrown error in the application or the previous middleware function calling `next` with an error as an argument will eventually go to this middleware function
app.use((err, req, res, next) => {
  console.error(err);
  // We can now specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, 'localhost', () => {
  console.log(`My first Express app - listening on localhost:${PORT}!`);
});
