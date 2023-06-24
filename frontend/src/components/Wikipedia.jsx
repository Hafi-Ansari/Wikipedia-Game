import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import socket from "../../socket";

const Wikipedia = () => {
  const location = useLocation();
  const [counter, setCounter] = useState(0);
  const [firstLoadCompleted, setFirstLoadCompleted] = useState(false);
  const { startLink, endLink, room } = location.state;

  useEffect(() => {
    socket.on("counterUpdate", (counter) => {
      setCounter(counter);
    });
    return () => {
      socket.off("counterUpdate");
    };
  }, []);

  useEffect(() => {
    socket.on("room-data", (data) => {
      setCounter(data.counter);
    });
    return () => {
      socket.off("room-data");
    };
  }, []);

  const handleLoad = useCallback(() => {
    if (firstLoadCompleted) {
      socket.emit("incrementCounter", room);
    } else {
      setFirstLoadCompleted(true);
    }
  }, [firstLoadCompleted]);

  const resetCounter = () => {
    socket.emit("reset", room);
  };

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center h-full bg-dark-primary">
        <div className="flex flex-col bg-gray-200 p-4 rounded-lg border-4 border-black bg-dark-secondary">
          <div className="inline-flex justify-center font-bold">
            <button
              className="border-4 w-21 mr-4  rounded-lg p-2 bg-dark-ternary hover:bg-accent-1"
              onClick={resetCounter}
            >
              Reset Count
            </button>
            <button className="border-4 w-21 rounded-lg p-2 bg-dark-ternary cursor-not-allowed">
              Link Clicks: {counter}
            </button>
          </div>
          <div className="text-center m-2 border-2 font-bold rounded-lg bg-dark-ternary">
            <a href={startLink}>Start Link: {startLink} </a>
            <br></br>
            <a href={endLink}>Goal Link: {endLink}</a>
          </div>
          <div className="border-4">
            <iframe
              title={startLink}
              src={startLink}
              width="1000px"
              height="400px"
              style={{ border: "none" }}
              onLoad={handleLoad}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wikipedia;