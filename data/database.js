// Google research
// DNS Issues(Common with Node.js on Windows)
// Force Node.js to use a reliable public DNS server (like Google's or Cloudflare's) before establishing a connection
require('node:dns/promises').setServers(['1.1.1.1', '8.8.8.8']);

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
  if (database) {
    console.log('Db is already initialized!');
    return callback(null, database);
  }
  MongoClient.connect(process.env.MONGODB_URL)
    .then(async (client) => {
      database = client;
      const db = client.db('movies');

      await db.collection('users').createIndex({ githubId: 1 }, { unique: true });
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('directors').createIndex({ lastName: 1, firstName: 1 });
      await db.collection('actors').createIndex({ lastName: 1, firstName: 1 });
      await db.collection('movies').createIndex({ title: 1, releaseYear: 1 }, { unique: true });
      await db.collection('movies').createIndex({ directorId: 1 });
      await db.collection('movies').createIndex({ actorIds: 1 });

      callback(null, database);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDatabase = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDatabase,
};
