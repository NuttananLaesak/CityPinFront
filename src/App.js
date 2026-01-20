import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./components/Register";
import Login from "./components/Login";
import CreateProject from "./components/User/CreateProject";
import SelectProject from "./components/User/SelectProject";
import ProjectMembers from "./components/User/ProjectMembers";
import Dashboard from "./components/User/Dashboard";
import MyPins from "./components/User/MyPins";
import ApprovePinProject from "./components/User/ApprovePinProject";
import ManagePinProject from "./components/User/ManagePinProject";
import PinDetail from "./components/User/PinDetail";
import CreatePin from "./components/User/CreatePin";
import AdminDashboard from "./components/Admin/Dashboard";
import EditPin from "./components/Admin/EditPins";
import AllPins from "./components/Admin/AllPins";
import AdminCreateProject from "./components/Admin/CreateProject";
import AdminEditProject from "./components/Admin/EditProject";
import AdminManageProject from "./components/Admin/ManageProject";
import AllProjects from "./components/Admin/AllProject";
import CreateCategory from "./components/Admin/CreateCategory";
import EditCategory from "./components/Admin/EditCategory";
import AllCategoty from "./components/Admin/Categories";

function App() {
  const [user, setUser] = useState(null);

  const redirectByRole = (user) =>
    user.is_admin ? "/admin/dashboard" : "/selectproject";

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
            user ? (
              <Navigate to={redirectByRole(user)} />
            ) : (
              <Register setUser={setUser} />
            )
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={redirectByRole(user)} />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        <Route
          path="/project/create"
          element={
            user ? (
              <CreateProject user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/selectproject"
          element={
            user ? (
              <SelectProject user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/projects/:projectId/members"
          element={<ProjectMembers user={user} setUser={setUser} />}
        />

        <Route
          path="/dashboard/:projectId"
          element={
            user ? (
              <Dashboard user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/projects/:projectId/my-pins"
          element={<MyPins user={user} setUser={setUser} />}
        />

        <Route
          path="/projects/:projectId/approve-pin-project"
          element={<ApprovePinProject user={user} setUser={setUser} />}
        />

        <Route
          path="/projects/:projectId/manage-pin-project"
          element={<ManagePinProject user={user} setUser={setUser} />}
        />

        <Route
          path="/projects/:projectId/pins/:pinId"
          element={<PinDetail user={user} setUser={setUser} />}
        />

        <Route
          path="/projects/:projectId/pins/create"
          element={
            user ? (
              <CreatePin user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AdminDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pin/edit/:id"
          element={
            <ProtectedRoute user={user} adminOnly>
              <EditPin user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pin/all"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AllPins user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/project/create"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AdminCreateProject user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/project/edit/:id"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AdminEditProject user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/project/manage"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AdminManageProject user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/project/all"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AllProjects user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/category/create"
          element={
            <ProtectedRoute user={user} adminOnly>
              <CreateCategory user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/category/edit/:id"
          element={
            <ProtectedRoute user={user} adminOnly>
              <EditCategory user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/category/all"
          element={
            <ProtectedRoute user={user} adminOnly>
              <AllCategoty user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            user ? (
              <Navigate to={redirectByRole(user)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
