const waitersRoutes = require('../routes/waitersRoute');

jest.mock('../utils/database', () => ({
    connectToDatabase: jest.fn(),
  }));
  
  // Define a test case
  describe("GET /GetWaiters", () => {
    let mockWaiters;
  
    beforeAll(() => {
      // Define mock waiters data
      mockWaiters = [
        {
          id: "64b9589e8deb94bdf8aa7f29",
          monday: ["John", "William", "James", "Charles"],
        },
      ];
  
      // Mock the database connection to return the mock data
      const { connectToDatabase } = require('../utils/database');
      connectToDatabase.mockResolvedValueOnce({
        db: jest.fn().mockReturnThis(),
        collection: jest.fn().mockReturnThis(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce(mockWaiters),
        close: jest.fn(),
      });
    });
  
    // Test that the route handler returns the expected response
    it("returns waiters data", async () => {
      const mockedReply = {
        send: jest.fn(),
        code: jest.fn(),
      };
  
      await waitersRoutes({}, mockedReply); // Passing an empty object as the first parameter
  
      expect(mockedReply.send).toHaveBeenCalledWith(mockWaiters);
      expect(mockedReply.code).not.toHaveBeenCalled();
    });
  });