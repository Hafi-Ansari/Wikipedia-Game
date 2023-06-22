import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Join = () => {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // useNavigate hook should be called here, inside the component

  useEffect(() => {
    socket.on("errorMessage", (message) => {
      setMessage(message);
    });

    socket.on("successMessage", (message) => {
      setMessage(message);
      navigate("/wiki");
    });

    return () => {
      socket.off("errorMessage");
      socket.off("successMessage");
    };
  }, [navigate]); // you should pass navigate as a dependency to useEffect

  const handleCreate = (event) => {
    event.preventDefault();
    socket.emit("createRoom", { room, password });
  };

  const handleJoin = (event) => {
    event.preventDefault();
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
