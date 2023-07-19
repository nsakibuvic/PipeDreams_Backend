import mongoose from "mongoose";

dotenv.config()

let connection = null;

export async function connectToDatabase() {
  if (connection && mongoose.connection.readyState === 1) {
    // If database connection already exists and is connected
    console.log("Using existing database connection");
    return connection;
  }

  try {
    // Create new database connection
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,      
      dbName: "staff",
    });

    console.log("Connected to database");

    connection = mongoose.connection;
    return connection;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}