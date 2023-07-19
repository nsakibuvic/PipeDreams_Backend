const fastify = require('fastify');
const { connectToDatabase } = require('./utils/database');
const Cook = require('./data/cooks.json');
const Waiter = require('./data/waiters.json');

// Create a new Fastify instance
const app = fastify();

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
  });

// Define the /GetCooks API
app.get('/GetCooks', async (request, reply) => {
  const Cook = app.mongo.db.collection('cooks');
  const cooks = await Cook.find().toArray();
  reply.send(cooks);
});

// Define the /GetWaiters API
app.get('/GetWaiters', async (request, reply) => {
  const Waiter = app.mongo.db.collection('waiters');
  const waiters = await Waiter.find().toArray();
  reply.send(waiters);
});

// Start the server
app.listen(8000, (err, address) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});