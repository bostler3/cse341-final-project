const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const errorPayload = (code, message) => ({ code, message });

const splitName = (value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return { firstName: value, lastName: value };
  }

  const parts = value.trim().split(/\s+/);

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

const buildDirectorDocument = (body, existingDirector = {}) => {
  const nameParts = splitName(body.name ?? existingDirector.name);

  const director = {
    firstName: body.firstName?.trim() ?? existingDirector.firstName ?? nameParts.firstName,
    lastName: body.lastName?.trim() ?? existingDirector.lastName ?? nameParts.lastName,
    birthDate:
      body.birthDate ?? body.birthdate ?? existingDirector.birthDate ?? existingDirector.birthdate,
    nationality: body.nationality?.trim() ?? existingDirector.nationality,
  };

  const awards = body.awards ?? existingDirector.awards;
  if (awards !== undefined) {
    director.awards = awards;
  }

  director.createdAt = existingDirector.createdAt ?? new Date();
  director.updatedAt = new Date();

  return director;
};

// Get all directors from database
const getAll = async (req, res) => {
  //#swagger.tags=["Directors"]
  try {
    const result = await mongodb
      .getDatabase()
      .db('movies')
      .collection('directors')
      .find()
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching directors:', error);
    res.status(500).json(errorPayload('DIRECTORS_FETCH_FAILED', 'Internal Server Error'));
  }
};

// Get a single director from database by director ID
const getSingle = async (req, res) => {
  //#swagger.tags=["Directors"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(
        errorPayload('INVALID_DIRECTOR_ID', 'Must use a valid director ID to find a director.')
      );
  }

  const directorId = new ObjectId(req.params.id);
  try {
    const director = await mongodb
      .getDatabase()
      .db('movies')
      .collection('directors')
      .findOne({ _id: directorId });

    if (!director) {
      return res.status(404).json(errorPayload('DIRECTOR_NOT_FOUND', 'Director not found.'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(director);
  } catch (error) {
    console.error('Error fetching director:', error);
    res.status(500).json(errorPayload('DIRECTOR_FETCH_FAILED', 'Internal Server Error'));
  }
};

// Create a new director
const createDirector = async (req, res) => {
  //#swagger.tags=["Directors"]
  try {
    const director = buildDirectorDocument(req.body);
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('directors')
      .insertOne(director);
    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res
        .status(500)
        .json(
          errorPayload('DIRECTOR_CREATE_FAILED', 'An error occurred while creating the director.')
        );
    }
  } catch (error) {
    console.error('Error creating director:', error);
    res.status(500).json(errorPayload('DIRECTOR_CREATE_FAILED', 'Internal Server Error'));
  }
};

// Modify an existing director
const modifyDirector = async (req, res) => {
  //#swagger.tags=["Directors"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(
        errorPayload('INVALID_DIRECTOR_ID', 'Must use a valid director ID to modify a director.')
      );
  }

  const directorId = new ObjectId(req.params.id);
  try {
    const existingDirector = await mongodb
      .getDatabase()
      .db('movies')
      .collection('directors')
      .findOne({ _id: directorId });

    if (!existingDirector) {
      return res.status(404).json(errorPayload('DIRECTOR_NOT_FOUND', 'Director not found.'));
    }

    const director = buildDirectorDocument(req.body, existingDirector);
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('directors')
      .replaceOne({ _id: directorId }, director);

    if (response.matchedCount === 0) {
      return res.status(404).json(errorPayload('DIRECTOR_NOT_FOUND', 'Director not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error updating director:', error);
    res.status(500).json(errorPayload('DIRECTOR_UPDATE_FAILED', 'Internal Server Error'));
  }
};

// Delete an existing director
const deleteDirector = async (req, res) => {
  //#swagger.tags=["Directors"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(
        errorPayload('INVALID_DIRECTOR_ID', 'Must use a valid director ID to delete a director.')
      );
  }

  const directorId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('directors')
      .deleteOne({ _id: directorId });

    if (response.deletedCount === 0) {
      return res.status(404).json(errorPayload('DIRECTOR_NOT_FOUND', 'Director not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting director:', error);
    res.status(500).json(errorPayload('DIRECTOR_DELETE_FAILED', 'Internal Server Error'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createDirector,
  modifyDirector,
  deleteDirector,
};
