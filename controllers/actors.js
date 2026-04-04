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

const buildActorDocument = (body, existingActor = {}) => {
  const nameParts = splitName(body.name ?? existingActor.name);

  const actor = {
    firstName: body.firstName?.trim() ?? existingActor.firstName ?? nameParts.firstName,
    lastName: body.lastName?.trim() ?? existingActor.lastName ?? nameParts.lastName,
    birthDate:
      body.birthDate ?? body.birthdate ?? existingActor.birthDate ?? existingActor.birthdate,
    nationality: body.nationality?.trim() ?? existingActor.nationality,
  };

  const awards = body.awards ?? existingActor.awards;
  if (awards !== undefined) {
    actor.awards = awards;
  }

  actor.createdAt = existingActor.createdAt ?? new Date();
  actor.updatedAt = new Date();

  return actor;
};

// Get all actors from database
const getAll = async (req, res) => {
  //#swagger.tags=["Actors"]
  try {
    const result = await mongodb.getDatabase().db('movies').collection('actors').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json(errorPayload('ACTORS_FETCH_FAILED', 'Internal Server Error'));
  }
};

// Get a single actor from database by actor ID
const getSingle = async (req, res) => {
  //#swagger.tags=["Actors"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(errorPayload('INVALID_ACTOR_ID', 'Must use a valid actor ID to find an actor.'));
  }

  const actorId = new ObjectId(req.params.id);
  try {
    const actor = await mongodb
      .getDatabase()
      .db('movies')
      .collection('actors')
      .findOne({ _id: actorId });

    if (!actor) {
      return res.status(404).json(errorPayload('ACTOR_NOT_FOUND', 'Actor not found.'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(actor);
  } catch (error) {
    console.error('Error fetching actor:', error);
    res.status(500).json(errorPayload('ACTOR_FETCH_FAILED', 'Internal Server Error'));
  }
};

// Create a new actor
const createActor = async (req, res) => {
  //#swagger.tags=["Actors"]
  try {
    const actor = buildActorDocument(req.body);
    const response = await mongodb.getDatabase().db('movies').collection('actors').insertOne(actor);
    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res
        .status(500)
        .json(errorPayload('ACTOR_CREATE_FAILED', 'An error occurred while creating the actor.'));
    }
  } catch (error) {
    console.error('Error creating actor:', error);
    res.status(500).json(errorPayload('ACTOR_CREATE_FAILED', 'Internal Server Error'));
  }
};

// Modify an existing actor
const modifyActor = async (req, res) => {
  //#swagger.tags=["Actors"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(errorPayload('INVALID_ACTOR_ID', 'Must use a valid actor ID to modify an actor.'));
  }

  const actorId = new ObjectId(req.params.id);
  try {
    const existingActor = await mongodb
      .getDatabase()
      .db('movies')
      .collection('actors')
      .findOne({ _id: actorId });

    if (!existingActor) {
      return res.status(404).json(errorPayload('ACTOR_NOT_FOUND', 'Actor not found.'));
    }

    const actor = buildActorDocument(req.body, existingActor);
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('actors')
      .replaceOne({ _id: actorId }, actor);

    if (response.matchedCount === 0) {
      return res.status(404).json(errorPayload('ACTOR_NOT_FOUND', 'Actor not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error updating actor:', error);
    res.status(500).json(errorPayload('ACTOR_UPDATE_FAILED', 'Internal Server Error'));
  }
};

// Delete an existing actor
const deleteActor = async (req, res) => {
  //#swagger.tags=["Actors"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(errorPayload('INVALID_ACTOR_ID', 'Must use a valid actor ID to delete an actor.'));
  }

  const actorId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('actors')
      .deleteOne({ _id: actorId });

    if (response.deletedCount === 0) {
      return res.status(404).json(errorPayload('ACTOR_NOT_FOUND', 'Actor not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting actor:', error);
    res.status(500).json(errorPayload('ACTOR_DELETE_FAILED', 'Internal Server Error'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createActor,
  modifyActor,
  deleteActor,
};
