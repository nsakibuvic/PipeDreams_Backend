require('dotenv').config()

const mongodb = require("mongodb");
const Cooks = require("../data/cooks.json");
const Waiters = require("../data/waiters.json");

async function connectToDatabase() {
  const client = new mongodb.MongoClient(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await client.connect();
  console.log("Connected to MongoDB");
  return client;
}

async function createDatabaseAndCollections(dbClient) {
  const db = dbClient.db("staff");
  const cooksCollection = db.collection("cooks");
  const waitersCollection = db.collection("waiters");
  
  // Monngo DB require data to be in an array thus converting the data into an array. 
  await cooksCollection.insertMany([Cooks]);
  await waitersCollection.insertMany([Waiters]);

  console.log("Inserted data into 'cooks' and 'waiters' collections");
}

async function initializeDatabase() {
  const dbClient = await connectToDatabase();
  await createDatabaseAndCollections(dbClient);
  await dbClient.close();
  console.log("Closed MongoDB connection");
}

module.exports = {
  initializeDatabase,
  connectToDatabase
};