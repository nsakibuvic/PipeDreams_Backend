// Import Fastify and any other required dependencies
const fastify = require('fastify')();
const { connectToDatabase } = require('../utils/database'); 

const cooksRoutes = async (fastify, options) => {
  fastify.get("/GetCooks", async (request, reply) => {
    try {
      // Query the "cooks" collection and retrieve all documents
      const dbClient = await connectToDatabase();
      const db = dbClient.db("staff");
      const cooksCollection = db.collection("cooks");
      const cooksData = await cooksCollection.find({}).toArray();
      dbClient.close(); // Close the connection after fetching the data

      reply.send(cooksData);
    } catch (error) {
      console.error("Error fetching cooks:", error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  });
};

module.exports = cooksRoutes;