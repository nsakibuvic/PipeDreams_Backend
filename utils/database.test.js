const { connectToDatabase } = require('./database');

// Connects Successfully to Database

describe('Database connection', () => {
  it('Should connect to the database', async () => {
    const dbClient = await connectToDatabase();
    expect(dbClient.connect()).toBeTruthy();
    await dbClient.close();
  });
});