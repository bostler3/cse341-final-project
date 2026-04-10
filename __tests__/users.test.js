const userController = require('../controllers/users');
const mongodb = require('../data/database');

// Mock the database module
jest.mock('../data/database');

describe('User Controller - GET Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [
        {
          _id: '507f1f77bcf86cd799439011',
          displayName: 'John.Doe',
          role: 'editor',
          email: 'john@example.com',
          githubId: '12345',
        },
        {
          _id: '507f1f77bcf86cd799439012',
          displayName: 'Jane.Smith',
          role: 'editor',
          email: 'jane@example.com',
          githubId: '67890',
        },
      ];

      const mockUserCollection = {
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockUsers),
        }),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockUserCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getAll(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 on database error', async () => {
      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            find: jest.fn().mockImplementation(() => {
              throw new Error('Database connection failed');
            }),
          }),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 'USERS_FETCH_FAILED',
        message: 'Internal Server Error',
      });
    });
  });

  describe('getSingle', () => {
    it('should fetch a single user by ID', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockUser = {
        _id: userId,
        displayName: 'John.Doe',
        role: 'editor',
        email: 'john@example.com',
        githubId: '12345',
      };

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockUserCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: userId } };
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getSingle(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('should return 400 for invalid ID format', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 'INVALID_USER_ID',
        message: 'Must use a valid user ID to find a user.',
      });
    });

    it('should return 404 when user not found', async () => {
      const userId = '507f1f77bcf86cd799439011';

      const mockUserCollection = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockUserCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: userId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await userController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 'USER_NOT_FOUND',
        message: 'User not found.',
      });
    });
  });
});
