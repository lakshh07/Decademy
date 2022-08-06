import "./App.css";
import "./css/loading.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingContext from "./context/loading";
import Hero from "./pages/Hero";
import Quests from "./pages/quests/Quests";
import Loading from "./components/Loading";
import { Box } from "@chakra-ui/react";
import NewQuest from "./pages/quests/NewQuest";

function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <Loading />
        <Box className="body-bg">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/quests/new" element={<NewQuest />} />
          </Routes>
        </Box>
      </LoadingContext.Provider>
    </>
  );
}

export default App;
