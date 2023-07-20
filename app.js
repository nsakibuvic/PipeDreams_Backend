const fastify = require("fastify");
const { initializeDatabase,connectToDatabase } = require("./utils/database");
const customCorsPlugin = require("./utils/cors-plugin"); // Import the custom CORS plugin

// Create a new Fastify instance
const app = fastify();

// Register the custom CORS plugin. Fastify Cors giving error.
app.register(customCorsPlugin);

// Connect to MongoDB
initializeDatabase()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });

// Route handler for '/GetCooks'
app.get("/GetCooks", async (request, reply) => {
  try {
    // Query the "waiters" collection and retrieve all documents
    const dbClient = await connectToDatabase();
    const db = dbClient.db("staff");
    const waitersCollection = db.collection("cooks");
    const waitersData = await waitersCollection.find({}).toArray();
    dbClient.close(); // Close the connection after fetching the data

    reply.send(waitersData);
  } catch (error) {
    console.error("Error fetching waiters:", error);
    reply.code(500).send({ error: "Internal Server Error" });
  }
});
// Route handler for '/GetWaiters'
app.get("/GetWaiters", async (request, reply) => {
  try {
    // Query the "waiters" collection and retrieve all documents
    const dbClient = await connectToDatabase();
    const db = dbClient.db("staff");
    const waitersCollection = db.collection("waiters");
    const waitersData = await waitersCollection.find({}).toArray();
    dbClient.close(); // Close the connection after fetching the data

    reply.send(waitersData);
  } catch (error) {
    console.error("Error fetching waiters:", error);
    reply.code(500).send({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});