const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'movie_api';

let client;
let db;

async function connectToDb() {
  if (db) {
    return db;
  }

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file.');
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);
  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDb() first.');
  }

  return db;
}

module.exports = {
  connectToDb,
  getDb,
};
