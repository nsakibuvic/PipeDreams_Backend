require("dotenv").config();

const mongodb = require("mongodb");
const Cooks = require("../data/cooks.json");
const Waiters = require("../data/waiters.json");

async function connectToDatabase() {
	const client = new mongodb.MongoClient(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	console.log("Connected to MongoDB");
	return client;
}

async function createDatabaseAndCollections(dbClient) {
	const db = dbClient.db("staff");
	const cooksCollection = db.collection("cooks");
	const waitersCollection = db.collection("waiters");

	const cooksCount = await cooksCollection.countDocuments();
	const waitersCount = await waitersCollection.countDocuments();

	if (cooksCount === 0) {
		await cooksCollection.insertMany([Cooks]);
		console.log("Inserted data into 'cooks' collection");
	} else {
		console.log(
			"'cooks' collection already contains data. Skipping insertion."
		);
	}

	if (waitersCount === 0) {
		await waitersCollection.insertMany([Waiters]);
		console.log("Inserted data into 'waiters' collection");
	} else {
		console.log(
			"'waiters' collection already contains data. Skipping insertion."
		);
	}
}

async function initializeDatabase() {
	const dbClient = await connectToDatabase();
	await createDatabaseAndCollections(dbClient);
	await dbClient.close();
	console.log("Closed MongoDB connection");
}

module.exports = {
	initializeDatabase,
	connectToDatabase,
};
