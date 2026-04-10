const movieController = require('../controllers/movies');
const mongodb = require('../data/database');

// Mock the database module
jest.mock('../data/database');

describe('Movie Controller - GET Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all movies successfully', async () => {
      const mockMovies = [
        {
          _id: '507f1f77bcf86cd799439011',
          title: 'The Dark Knight',
          releaseYear: 2008,
          genre: ['Action', 'Crime'],
          rating: 'PG-13',
        },
        {
          _id: '507f1f77bcf86cd799439012',
          title: 'Inception',
          releaseYear: 2010,
          genre: ['Action', 'Sci-Fi'],
          rating: 'PG-13',
        },
      ];

      const mockMovieCollection = {
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockMovies),
        }),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockMovieCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = {};
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await movieController.getAll(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMovies);
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

      await movieController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 'MOVIES_FETCH_FAILED',
        message: 'Internal Server Error',
      });
    });
  });

  describe('getSingle', () => {
    it('should fetch a single movie by ID', async () => {
      const movieId = '507f1f77bcf86cd799439011';
      const mockMovie = {
        _id: movieId,
        title: 'The Dark Knight',
        releaseYear: 2008,
        genre: ['Action', 'Crime'],
        rating: 'PG-13',
      };

      const mockMovieCollection = {
        findOne: jest.fn().mockResolvedValue(mockMovie),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockMovieCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: movieId } };
      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await movieController.getSingle(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMovie);
    });

    it('should return 400 for invalid ID format', async () => {
      const req = { params: { id: 'invalid-id' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await movieController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 'INVALID_MOVIE_ID',
        message: 'Must use a valid movie ID to find a movie.',
      });
    });

    it('should return 404 when movie not found', async () => {
      const movieId = '507f1f77bcf86cd799439011';

      const mockMovieCollection = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const mockDb = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue(mockMovieCollection),
        }),
      };

      mongodb.getDatabase.mockReturnValue(mockDb);

      const req = { params: { id: movieId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await movieController.getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 'MOVIE_NOT_FOUND',
        message: 'Movie not found.',
      });
    });
  });
});
