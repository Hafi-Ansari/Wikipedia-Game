import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from '../../socket'

const Join = () => {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [startLink, setStartLink] = useState("");
  const [endLink, setEndLink] = useState("");
  const [readyToNavigate, setReadyToNavigate] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("errorMessage", (message) => {
      setMessage(message);
    });

    socket.on("successMessage", (message) => {
      setMessage(message);
      setReadyToNavigate(true);
    });

    socket.on("room-data", ({ startLink, endLink }) => {
      setStartLink(startLink);
      setEndLink(endLink);
      setReadyToNavigate(true);
    });

    return () => {
      socket.off("errorMessage");
      socket.off("successMessage");
      socket.off("room-data");
    };
  }, [navigate]);

  useEffect(() => {
    if (startLink && endLink && readyToNavigate) {
      navigate("/wiki", { state: { room, startLink, endLink } });
    }
  }, [startLink, endLink, readyToNavigate, navigate]);

  const handleCreate = (event) => {
    event.preventDefault();
    setReadyToNavigate(false);
    socket.emit("createRoom", { room, password });
  };

  const handleJoin = (event) => {
    event.preventDefault();
    setReadyToNavigate(false);
    socket.emit("joinRoom", { room, password });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-dark-primary">
      <form className="flex flex-col bg-gray-200 p-4 rounded-lg border-4 border-black bg-dark-secondary">
        <input
          className="mb-2 p-1 border-gray-400 border-2 rounded-lg bg-dark-ternary"
          type="text"
          placeholder="Room Name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          className="mb-2 p-1 border-gray-400 border-2 rounded-lg bg-dark-ternary"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="mb-2 p-1 text-white rounded-lg border-2 bg-dark-ternary"
          onClick={handleCreate}
        >
          Create Room
        </button>
        <button
          className="mb-2 p-1 text-white rounded-lg border-2 bg-dark-ternary"
          onClick={handleJoin}
        >
          Join Room
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Join;
