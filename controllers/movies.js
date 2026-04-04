const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const errorPayload = (code, message) => ({ code, message });

const normalizeObjectId = (value) => {
  if (value instanceof ObjectId) {
    return value;
  }

  if (typeof value === 'string' && ObjectId.isValid(value)) {
    return new ObjectId(value);
  }

  return value;
};

const normalizeObjectIdArray = (values) => {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map((value) => normalizeObjectId(value));
};

const normalizeStringArray = (values) => {
  if (!Array.isArray(values)) {
    return typeof values === 'string' && values.trim() !== '' ? [values.trim()] : [];
  }

  return values
    .filter((value) => typeof value === 'string')
    .map((value) => value.trim())
    .filter((value) => value !== '');
};

const buildMovieDocument = (body, existingMovie = {}) => {
  const movie = {
    title: body.title?.trim() ?? existingMovie.title,
    releaseYear: Number(body.releaseYear ?? existingMovie.releaseYear),
    genre: normalizeStringArray(body.genre ?? existingMovie.genre),
    rating: body.rating?.trim() ?? existingMovie.rating,
    runtimeMinutes: Number(body.runtimeMinutes ?? existingMovie.runtimeMinutes ?? 0),
    directorId: normalizeObjectId(body.directorId ?? existingMovie.directorId),
    actorIds: normalizeObjectIdArray(body.actorIds ?? body.actors ?? existingMovie.actorIds),
  };

  const synopsis = body.synopsis ?? body.description ?? existingMovie.synopsis;
  if (synopsis !== undefined) {
    movie.synopsis = synopsis;
  }

  movie.createdAt = existingMovie.createdAt ?? new Date();
  movie.updatedAt = new Date();

  return movie;
};

const getAll = async (req, res, next) => {
  //#swagger.tags=["Movies"]
  try {
    const lists = await mongodb.getDatabase().db('movies').collection('movies').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json(errorPayload('MOVIES_FETCH_FAILED', 'Internal Server Error'));
  }
};

const getSingle = async (req, res, next) => {
  //#swagger.tags=["Movies"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json(errorPayload('INVALID_MOVIE_ID', 'Must use a valid movie ID to find a movie.'));
    }

    const movieId = new ObjectId(req.params.id);
    const movie = await mongodb
      .getDatabase()
      .db('movies')
      .collection('movies')
      .findOne({ _id: movieId });

    if (!movie) {
      return res.status(404).json(errorPayload('MOVIE_NOT_FOUND', 'Movie not found.'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(movie);
  } catch (err) {
    console.error('Error fetching movie:', err);
    res.status(500).json(errorPayload('MOVIE_FETCH_FAILED', 'Internal Server Error'));
  }
};

const createMovie = async (req, res) => {
  //#swagger.tags=["Movies"]
  try {
    const movie = buildMovieDocument(req.body);

    // 2. Insert with appropriate collection name
    const response = await mongodb.getDatabase().db('movies').collection('movies').insertOne(movie);

    // 3. Proper Response Handling
    if (response.acknowledged) {
      // 201 Created is better than 204
      res.status(201).json({ id: response.insertedId });
    } else {
      res.status(500).json(errorPayload('MOVIE_CREATE_FAILED', 'Failed to create movie.'));
    }
  } catch (error) {
    // 4. Catch errors (e.g., db connection issues)
    console.error('Error creating movie:', error);
    res.status(500).json(errorPayload('MOVIE_CREATE_FAILED', 'Internal Server Error'));
  }
};

const updateMovie = async (req, res) => {
  //#swagger.tags=["Movies"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json(errorPayload('INVALID_MOVIE_ID', 'Must use a valid movie ID to update a movie.'));
    }

    const movieId = new ObjectId(req.params.id);
    const existingMovie = await mongodb
      .getDatabase()
      .db('movies')
      .collection('movies')
      .findOne({ _id: movieId });

    if (!existingMovie) {
      return res.status(404).json(errorPayload('MOVIE_NOT_FOUND', 'Movie not found.'));
    }

    const movie = buildMovieDocument(req.body, existingMovie);
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('movies')
      .replaceOne({ _id: movieId }, movie);

    if (response.matchedCount === 0) {
      return res.status(404).json(errorPayload('MOVIE_NOT_FOUND', 'Movie not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error updating movie:', error);
    return res.status(500).json(errorPayload('MOVIE_UPDATE_FAILED', 'Internal Server Error'));
  }
};

const deleteMovie = async (req, res) => {
  //#swagger.tags=["Movies"]
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json(errorPayload('INVALID_MOVIE_ID', 'Must use a valid movie ID to delete a movie.'));
    }

    const movieId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('movies')
      .deleteOne({ _id: movieId });

    if (response.deletedCount === 0) {
      return res.status(404).json(errorPayload('MOVIE_NOT_FOUND', 'Movie not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting movie:', error);
    return res.status(500).json(errorPayload('MOVIE_DELETE_FAILED', 'Internal Server Error'));
  }
};

module.exports = { getAll, getSingle, createMovie, updateMovie, deleteMovie };
