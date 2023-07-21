const fastify = require('fastify');
const cooksRoutes = require('./cooksRoute');
const { connectToDatabase } = require('../utils/database');

jest.mock('../utils/database');

describe('GET /GetCooks', () => {
  let server;

  beforeAll(async () => {
    server = fastify();
    server.register(cooksRoutes);
    await server.ready();
  });

  afterAll(() => {
    server.close();
  });

  it('should return all cooks data', async () => {
    const mockData = [      
        {
            id: "64b9589e8deb94bdf8aa7f29",
            monday: ["John", "William", "James", "Charles"],
        },    
    ];

    const mockFind = {
      toArray: jest.fn().mockResolvedValue(mockData),
    };

    const mockCollection = {
      find: jest.fn().mockReturnValue(mockFind),
    };

    const mockDb = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    const mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
      close: jest.fn(),
    };

    connectToDatabase.mockResolvedValue(mockClient);

    const response = await server.inject({
      method: 'GET',
      url: '/GetCooks',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockData);
    expect(connectToDatabase).toBeCalled();
    expect(mockClient.db).toBeCalledWith('staff');
    expect(mockDb.collection).toBeCalledWith('cooks');
    expect(mockCollection.find).toBeCalled();
    expect(mockFind.toArray).toBeCalled();
    expect(mockClient.close).toBeCalled();
  });

  it('should handle errors', async () => {
    console.error = jest.fn(); // silence error output

    const mockError = new Error('Database error');
    connectToDatabase.mockRejectedValue(mockError);

    const response = await server.inject({
      method: 'GET',
      url: '/GetCooks',
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: "Internal Server Error" });
  });
});