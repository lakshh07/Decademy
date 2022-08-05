import "./App.css";
import "./css/loading.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingContext from "./context/loading";
import Hero from "./components/Hero";
import Quests from "./components/Quests";
import Loading from "./components/Loading";

function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <Loading />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/quests" element={<Quests />} />
        </Routes>
      </LoadingContext.Provider>
    </>
  );
}

export default App;
