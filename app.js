const fastify = require("fastify")();
const { initializeDatabase, connectToDatabase } = require("./utils/database");
const cors = require("@fastify/cors");

// Enable CORS for all routes
fastify.register(cors);
// Connect to MongoDB
initializeDatabase()
	.then(() => {
		console.log("Connected to database");
	})
	.catch((error) => {
		console.error("Error connecting to database:", error);
		process.exit(1);
	});

// Enable Routing
fastify.register(require("./routes/cooksRoute"));
fastify.register(require("./routes/waitersRoute"));

// Start the server
fastify.listen({ port: 8000 }, (err, address) => {
	if (err) {
		console.error("Error starting server:", err);
		process.exit(1);
	}
	console.log(`Server listening on ${address}`);
});
