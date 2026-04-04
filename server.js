const express = require("express");
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const mongodb = require('./data/database');

const app = express();
const swaggerRoutes = require('./routes/swagger');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use("/", require("./routes"));
// Mount the swagger routes
app.use('/api-docs', swaggerRoutes);

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {
            console.log(`database is listening and node running on port ${port}`);
        });
    }
});
