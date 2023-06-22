const express = require('express');
const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
