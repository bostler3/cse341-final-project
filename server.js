const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDb } = require('./db/connect');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes'));

async function startServer() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`Node is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
