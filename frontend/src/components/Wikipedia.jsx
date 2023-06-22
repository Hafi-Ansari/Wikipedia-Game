import React, { useState, useCallback, useEffect } from "react";

const Wikipedia = () => {
  const [counter, setCounter] = useState(-1);
  const [startLink, setStartLink] = useState("");
  const [endLink, setEndLink] = useState("");
  const [currentLink, setCurrentLink] = useState(""); 
  const [firstLoadCompleted, setFirstLoadCompleted] = useState(false);

  const handleLoad = useCallback(() => {
    if (firstLoadCompleted) {
      setCounter((prev) => prev + 1);
    } else {
      setFirstLoadCompleted(true);
    }
  }, [firstLoadCompleted]);

  useEffect(() => {
    const fetchAndSetLinks = async () => {
      const startLink = await fetchRandomLink();
      const endLink = await fetchRandomLink();

      setStartLink(startLink);
      setEndLink(endLink);
    };

    fetchAndSetLinks();
  }, []);

  const fetchRandomLink = async () => {
    const response = await fetch("http://localhost:5000/random");
    const data = await response.json();
    return data.url;
  };

  return (
    <div className="h-screen">
      <div className="flex justify-center items-center h-full bg-dark-primary">
        <div className="flex flex-col bg-gray-200 p-4 rounded-lg border-4 border-black bg-dark-secondary">
          <div className="text-center m-2 border-2 font-bold">
            <p>Link clicks: {counter}</p>
            <a href="https://en.wikipedia.org/wiki/Submersible">
              Start Link: {startLink}
            </a>
            <br></br>
            <a href="https://en.wikipedia.org/wiki/Submersible">
              Goal Link: {endLink}
            </a>
          </div>
          <div className="border-4">
            <iframe
              title="Submersible"
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
