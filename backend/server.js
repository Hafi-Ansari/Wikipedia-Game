const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.get('/random', async (req, res) => {
    try {
      const response = await fetch('https://en.wikipedia.org/wiki/Special:Random');
      res.json({ url: response.url });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch random article' });
    }
});

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let rooms = {};

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("createRoom", ({ room, password }) => {
    rooms[room] = password;
    console.log(`Room ${room} created with password ${password}`);
  });

  socket.on("joinRoom", ({ room, password }) => {
    if (rooms[room] === password) {
      socket.join(room);
      socket.emit("successMessage", `Successfully joined ${room}`);
    } else {
      socket.emit("errorMessage", "Incorrect room password");
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
