import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import WikipediaPage from "./pages/WikipediaPage";
import Join from "./pages/Join";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/wiki" element={<WikipediaPage />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
