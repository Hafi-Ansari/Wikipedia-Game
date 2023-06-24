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
  console.log("New WebSocket connection");

  socket.on("createRoom", async ({ room, password }) => {
    const startLink = await fetchRandomLink();
    const endLink = await fetchRandomLink();
    console.log(startLink);
    console.log(endLink);
    let counter = 0;
    rooms[room] = { password, startLink, endLink, counter };

    console.log(
      `Room ${room} created with password ${password} with a counter value of ${counter}`
    );
    socket.join(room);
    socket.emit("room-data", { startLink, endLink });
  });

  socket.on("joinRoom", ({ room, password }) => {
    const roomData = rooms[room];
    if (roomData && roomData.password === password) {
      socket.join(room);
      console.log(`User joined room ${room}`);
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
      console.log(rooms[room]);
      io.in(room).emit("counterUpdate", rooms[room].counter);
    }
  });

  socket.on("reset", (room) => {
    if (rooms[room]) {
      rooms[room].counter = 0;
      console.log(`Counter reset for room ${room}`);
      io.to(room).emit("room-data", rooms[room]);
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
