const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const errorPayload = (code, message) => ({ code, message });

const buildUserDocument = (body, existingUser = {}) => {
  const user = {
    displayName: body.displayName?.trim() ?? existingUser.displayName,
    email: body.email?.trim() ?? existingUser.email,
    role: body.role ?? existingUser.role ?? 'editor',
  };

  // githubId is typically set during OAuth but can be provided
  if (body.githubId !== undefined) {
    user.githubId = body.githubId;
  } else if (existingUser.githubId !== undefined) {
    user.githubId = existingUser.githubId;
  }

  user.createdAt = existingUser.createdAt ?? new Date();
  user.updatedAt = new Date();

  return user;
};

// Get all users from database
const getAll = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const result = await mongodb.getDatabase().db('movies').collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json(errorPayload('USERS_FETCH_FAILED', 'Internal Server Error'));
  }
};

// Get a single user from database by user ID
const getSingle = async (req, res) => {
  //#swagger.tags=["Users"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(errorPayload('INVALID_USER_ID', 'Must use a valid user ID to find a user.'));
  }

  const userId = new ObjectId(req.params.id);
  try {
    const user = await mongodb
      .getDatabase()
      .db('movies')
      .collection('users')
      .findOne({ _id: userId });

    if (!user) {
      return res.status(404).json(errorPayload('USER_NOT_FOUND', 'User not found.'));
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json(errorPayload('USER_FETCH_FAILED', 'Internal Server Error'));
  }
};

// Create a new user
const createUser = async (req, res) => {
  //#swagger.tags=["Users"]
  try {
    const user = buildUserDocument(req.body);
    const response = await mongodb.getDatabase().db('movies').collection('users').insertOne(user);
    if (response.acknowledged) {
      res.status(201).json({ id: response.insertedId });
    } else {
      res
        .status(500)
        .json(errorPayload('USER_CREATE_FAILED', 'An error occurred while creating the user.'));
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json(errorPayload('USER_CREATE_FAILED', 'Internal Server Error'));
  }
};

// Modify an existing user
const modifyUser = async (req, res) => {
  //#swagger.tags=["Users"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(errorPayload('INVALID_USER_ID', 'Must use a valid user ID to modify a user.'));
  }

  const userId = new ObjectId(req.params.id);
  try {
    const existingUser = await mongodb
      .getDatabase()
      .db('movies')
      .collection('users')
      .findOne({ _id: userId });

    if (!existingUser) {
      return res.status(404).json(errorPayload('USER_NOT_FOUND', 'User not found.'));
    }

    const user = buildUserDocument(req.body, existingUser);
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('users')
      .replaceOne({ _id: userId }, user);

    if (response.matchedCount === 0) {
      return res.status(404).json(errorPayload('USER_NOT_FOUND', 'User not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json(errorPayload('USER_UPDATE_FAILED', 'Internal Server Error'));
  }
};

// Delete an existing user
const deleteUser = async (req, res) => {
  //#swagger.tags=["Users"]
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json(errorPayload('INVALID_USER_ID', 'Must use a valid user ID to delete a user.'));
  }

  const userId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db('movies')
      .collection('users')
      .deleteOne({ _id: userId });

    if (response.deletedCount === 0) {
      return res.status(404).json(errorPayload('USER_NOT_FOUND', 'User not found.'));
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json(errorPayload('USER_DELETE_FAILED', 'Internal Server Error'));
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  modifyUser,
  deleteUser,
};
