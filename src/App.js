import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Projects from "./components/Project";
import MyPins from "./components/MyPins";
import AllPins from "./components/AllPins";
import Categories from "./components/Categories";
import CreateCategory from "./components/CreateCategory";
import EditCategory from "./components/EditCategory";
import CreatePin from "./components/CreatePin";
import CreateProject from "./components/CreateProject";
import EditProject from "./components/EditProject";
import ManageProjects from "./components/ManageProject";
import PinDetail from "./components/PinDetail";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={
            user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />
          }
        />

        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/projects"
          element={
            user ? (
              <Projects user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/my-pins"
          element={
            user ? (
              <MyPins user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/all-pins"
          element={
            user ? (
              <AllPins user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/categories"
          element={
            user ? (
              <Categories user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/categories/create"
          element={
            user ? (
              <CreateCategory user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/categories/edit/:id"
          element={
            user ? (
              <EditCategory user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/pins/create"
          element={
            user ? (
              <CreatePin user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/pins/:id"
          element={
            user ? (
              <PinDetail user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/projects/create"
          element={
            user ? (
              <CreateProject user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/projects/edit/:id"
          element={
            user ? (
              <EditProject user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/projects/manage"
          element={
            user ? (
              <ManageProjects user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="*"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
