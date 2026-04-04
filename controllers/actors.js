const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Get all actors from database
const getAll = async (req, res) => {
  //#swagger.tags=["Actors"]
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("actors")
      .find()
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "An error occurred." });
  }
};

// Get a single actor from database by actor ID
const getSingle = async (req, res) => {
  //#swagger.tags=["Actors"]
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid actor ID to find an actor.");
  }
  const actorId = new ObjectId(req.params.id);
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("actors")
      .find({ _id: actorId })
      .toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(400).json({ message: "An error occurred." });
  }
};

// Create a new actor
const createActor = async (req, res) => {
  //#swagger.tags=["Actors"]
  const actor = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthdate: req.body.birthdate,
    nationality: req.body.nationality,
    movies: req.body.movieIds,
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("actors")
      .insertOne(actor);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "An error occurred while creating the actor.");
    }
  } catch (error) {
    res.status(400).json({ message: "An error occurred." });
  }
};

// Modify an existing actor
const modifyActor = async (req, res) => {
  //#swagger.tags=["Actors"]
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid actor ID to modify an actor.");
  }
  const actorId = new ObjectId(req.params.id);
  const actor = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthdate: req.body.birthdate,
    nationality: req.body.nationality,
    movies: req.body.movieIds,
  };
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("actors")
      .replaceOne({ _id: actorId }, actor);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "An error occurred while modifying the actor.");
    }
  } catch (error) {
    res.status(400).json({ message: "An error occurred." });
  }
};

// Delete an existing actor
const deleteActor = async (req, res) => {
  //#swagger.tags=["Actors"]
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid actor ID to delete an actor.");
  }
  const actorId = new ObjectId(req.params.id);
  try {
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("actors")
      .deleteOne({ _id: actorId });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "An error occurred while deleting the actor.");
    }
  } catch (error) {
    res.status(400).json({ message: "An error occurred." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createActor,
  modifyActor,
  deleteActor,
};
