const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const fetchRandomLink = async () => {
  const response = await fetch("https://en.wikipedia.org/wiki/Special:Random");
  return response.url;
};

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let rooms = {}; // { room1: { password: 'password1', startLink: 'startLink1', endLink: 'endLink1' }, ... }

io.on("connection", (socket) => {
  socket.on("createRoom", async ({ room, password }) => {
    const startLink = await fetchRandomLink();
    const endLink = await fetchRandomLink();
    let counter = 0;
    rooms[room] = { password, startLink, endLink, counter };
    socket.join(room);
    socket.emit("room-data", { startLink, endLink });
  });

  socket.on("joinRoom", ({ room, password }) => {
    const roomData = rooms[room];
    if (roomData && roomData.password === password) {
      socket.join(room);
      socket.emit("successMessage", `Successfully joined ${room}`);
      socket.emit("room-data", {
        startLink: roomData.startLink,
        endLink: roomData.endLink,
        counter: roomData.counter,
      });
    } else {
      socket.emit("errorMessage", "Incorrect room password");
    }
  });

  socket.on("incrementCounter", (room) => {
    if (rooms[room]) {
      rooms[room].counter++;
      io.in(room).emit("counterUpdate", rooms[room].counter);
    }
  });

  socket.on("reset", (room) => {
    if (rooms[room]) {
      rooms[room].counter = 0;
      io.to(room).emit("room-data", rooms[room]);
    }
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {});
