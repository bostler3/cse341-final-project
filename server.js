const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Node is running on port ${port}`);
});
