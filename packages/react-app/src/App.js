import "./App.css";
import "./css/loading.css";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingContext from "./context/loading";
import Hero from "./pages/Hero";
import Quests from "./pages/quests/Quests";
import Loading from "./components/Loading";
import NewQuest from "./pages/quests/NewQuest";
import Podcasts from "./pages/podcasts/Podcasts";
import NewPodcasts from "./pages/podcasts/NewPodcasts";
import { Box } from "@chakra-ui/react";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/courses/Courses";
import Course from "./pages/courses/Course";
import ViewCourse from "./pages/courses/ViewCourse";
import ViewRequest from "./pages/courses/ViewRequest";
import NewCourse from "./pages/courses/NewCourse";
import NewRequest from "./pages/courses/NewRequest";

function App() {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        <Loading />
        <Box className="body-bg">
          <Routes>
            <Route path="/" element={<Hero />} />

            <Route path="dashboard" element={<Dashboard />} />

            <Route path="/dashboard/quests" element={<Quests />} />
            <Route path="/dashboard/quests/new" element={<NewQuest />} />

            <Route path="/dashboard/podcasts" element={<Podcasts />} />
            <Route path="/dashboard/podcasts/new" element={<NewPodcasts />} />

            <Route path="/dashboard/courses" element={<Courses />} />
            <Route path="/dashboard/courses/:id" element={<Course />} />
            <Route
              path="/dashboard/courses/:id/version/:version"
              element={<ViewCourse />}
            />
            <Route
              path="/dashboard/courses/:id/requests/:reqId"
              element={<ViewRequest />}
            />
            <Route path="/dashboard/courses/new" element={<NewCourse />} />
            <Route
              path="/dashboard/courses/:id/requests/new"
              element={<NewRequest />}
            />
          </Routes>
        </Box>
      </LoadingContext.Provider>
    </>
  );
}

export default App;
