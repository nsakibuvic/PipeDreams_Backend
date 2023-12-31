const fastify = require('fastify');
const waitersRoutes = require('./waitersRoute');
const { connectToDatabase } = require('../utils/database');

jest.mock('../utils/database');

describe('GET /GetWaiters', () => {
  let server;

  beforeAll(async () => {
    server = fastify();
    server.register(waitersRoutes);
    await server.ready();
  });

  afterAll(() => {
    server.close();
  });

  it('should return all waiters data', async () => {
    const mockData = [
        {
            id: "64b9589e8deb94bdf8aa7f2a",
            monday: ["Howard","Martin","Michael","Bert"],
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
      url: '/GetWaiters',
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual(mockData);
    expect(connectToDatabase).toBeCalled();
    expect(mockClient.db).toBeCalledWith('staff');
    expect(mockDb.collection).toBeCalledWith('waiters');
    expect(mockCollection.find).toBeCalled();
    expect(mockFind.toArray).toBeCalled();
    expect(mockClient.close).toBeCalled();
  });

  it('should handle errors', async () => {
    const mockError = new Error('Database error');

    connectToDatabase.mockRejectedValue(mockError);

    const response = await server.inject({
      method: 'GET',
      url: '/GetWaiters',
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({ error: "Internal Server Error" });
  });
});
