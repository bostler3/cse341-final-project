const directorController = require('../controllers/directors');
const mongodb = require('../data/database');

// Mock the database module
jest.mock('../data/database');

describe('Director Controller - GET Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all directors successfully', async () => {
      const mockDirectors = [
        {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'Robert',
          lastName: 'Zemeckis',
          birthDate: '1951-05-14',
          nationality: 'American',
        },
        {
          _id: '507f1f77bcf86cd799439012',
          firstName: 'Steven',
          lastName: 'Spielberg',
          birthDate: '1946-12-18',
          nationality: 'American',
        },
      ];

      const mockDirectorCollection = {
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockDirectors),
        }),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockDirectorCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await directorController.getAll(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDirectors);
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

      await directorController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 'DIRECTORS_FETCH_FAILED',
        message: 'Internal Server Error',
      });
    });
  });

  describe('getSingle', () => {
    it('should fetch a single director by ID', async () => {
      const directorId = '507f1f77bcf86cd799439011';
      const mockDirector = {
        _id: directorId,
        firstName: 'Robert',
        lastName: 'Zemeckis',
        birthDate: '1951-05-14',
        nationality: 'American',
      };

      const mockDirectorCollection = {
        findOne: jest.fn().mockResolvedValue(mockDirector),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockDirectorCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: directorId } };
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await directorController.getSingle(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDirector);
    });

    it('should return 400 for invalid ID format', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await directorController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 'INVALID_DIRECTOR_ID',
        message: 'Must use a valid director ID to find a director.',
      });
    });

    it('should return 404 when director not found', async () => {
      const directorId = '507f1f77bcf86cd799439011';

      const mockDirectorCollection = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockDirectorCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: directorId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await directorController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 'DIRECTOR_NOT_FOUND',
        message: 'Director not found.',
      });
    });
  });
});
