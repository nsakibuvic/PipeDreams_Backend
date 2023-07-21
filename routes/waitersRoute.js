// Import Fastify and any other required dependencies
const fastify = require('fastify')();
const { connectToDatabase } = require('../utils/database'); 

const waitersRoutes = async (fastify, options) => {
  fastify.get("/GetWaiters", async (request, reply) => {
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
};

module.exports = waitersRoutes;