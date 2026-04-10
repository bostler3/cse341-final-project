const actorController = require('../controllers/actors');
const mongodb = require('../data/database');

// Mock the database module
jest.mock('../data/database');

describe('Actor Controller - GET Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all actors successfully', async () => {
      const mockActors = [
        {
          _id: '507f1f77bcf86cd799439011',
          firstName: 'Christian',
          lastName: 'Bale',
          birthDate: '1974-01-30',
          nationality: 'British',
        },
        {
          _id: '507f1f77bcf86cd799439012',
          firstName: 'Leonardo',
          lastName: 'DiCaprio',
          birthDate: '1974-11-11',
          nationality: 'American',
        },
      ];

      const mockActorCollection = {
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockActors),
        }),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockActorCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await actorController.getAll(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActors);
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

      await actorController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 'ACTORS_FETCH_FAILED',
        message: 'Internal Server Error',
      });
    });
  });

  describe('getSingle', () => {
    it('should fetch a single actor by ID', async () => {
      const actorId = '507f1f77bcf86cd799439011';
      const mockActor = {
        _id: actorId,
        firstName: 'Christian',
        lastName: 'Bale',
        birthDate: '1974-01-30',
        nationality: 'British',
      };

      const mockActorCollection = {
        findOne: jest.fn().mockResolvedValue(mockActor),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockActorCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: actorId } };
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await actorController.getSingle(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActor);
    });

    it('should return 400 for invalid ID format', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await actorController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 'INVALID_ACTOR_ID',
        message: 'Must use a valid actor ID to find an actor.',
      });
    });

    it('should return 404 when actor not found', async () => {
      const actorId = '507f1f77bcf86cd799439011';

      const mockActorCollection = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockActorCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: actorId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await actorController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 'ACTOR_NOT_FOUND',
        message: 'Actor not found.',
      });
    });
  });
});
