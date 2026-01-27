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
import CreateProject from "./components/Public/CreateProject";
import EditProject from "./components/Public/EditProject";
import CreatePin from "./components/Public/CreatePin";
import EditPin from "./components/Public/EditPins";
import SelectProject from "./components/User/SelectProject";
import ProjectMembers from "./components/User/ProjectMembers";
import Dashboard from "./components/User/Dashboard";
import MyPins from "./components/User/MyPins";
import RecycleBinPins from "./components/Public/ReCyclePin";
import ApprovePinProject from "./components/User/ApprovePinProject";
import ManagePinProject from "./components/User/ManagePinProject";
import PinDetail from "./components/User/PinDetail";
import AdminDashboard from "./components/Admin/Dashboard";
import AllUsers from "./components/Admin/AllUser";
import RecycleUsers from "./components/Admin/RecycleUser";
import AllRoles from "./components/Admin/AllRole";
import RecycleRoles from "./components/Admin/RecycleRole";
import AllPins from "./components/Admin/AllPins";
import AdminManageProject from "./components/Admin/ManageProject";
import AllProjects from "./components/Admin/AllProject";
import RecycleProjects from "./components/Admin/RecycleProject";
import CreateCategory from "./components/Admin/CreateCategory";
import EditCategory from "./components/Admin/EditCategory";
import AllCategoty from "./components/Admin/Categories";
import RecycleCategoty from "./components/Admin/RecycleCategory";
import Profile from "./components/Public/Profile";

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

        {/* user routes */}
        <Route element={<ProtectedRoute user={user} />}>
          <Route
            path="/profile"
            element={<Profile user={user} setUser={setUser} />}
          />
          <Route
            path="/project/create"
            element={<CreateProject user={user} setUser={setUser} />}
          />
          <Route
            path="/project/edit/:id"
            element={<EditProject user={user} setUser={setUser} />}
          />
          <Route
            path="/selectproject"
            element={<SelectProject user={user} setUser={setUser} />}
          />
          <Route
            path="/projects/:projectId/members"
            element={<ProjectMembers user={user} setUser={setUser} />}
          />
          <Route
            path="/dashboard/:projectId"
            element={<Dashboard user={user} setUser={setUser} />}
          />
          <Route
            path="/projects/:projectId/my-pins"
            element={<MyPins user={user} setUser={setUser} />}
          />
          <Route
            path="/recycle-bin-pin"
            element={<RecycleBinPins user={user} setUser={setUser} />}
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
            path="/projects/:projectId/pins/create"
            element={<CreatePin user={user} setUser={setUser} />}
          />
          <Route
            path="/pin/edit/:id"
            element={<EditPin user={user} setUser={setUser} />}
          />
          <Route
            path="/projects/:projectId/pins/:pinId"
            element={<PinDetail user={user} setUser={setUser} />}
          />
        </Route>

        {/* admin routes */}
        <Route element={<ProtectedRoute user={user} adminOnly />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/user/all"
            element={<AllUsers user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/user/recycle"
            element={<RecycleUsers user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/role/all"
            element={<AllRoles user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/role/recycle"
            element={<RecycleRoles user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/pin/all"
            element={<AllPins user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/project/manage"
            element={<AdminManageProject user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/project/all"
            element={<AllProjects user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/project/recycle"
            element={<RecycleProjects user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/category/create"
            element={<CreateCategory user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/category/edit/:id"
            element={<EditCategory user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/category/all"
            element={<AllCategoty user={user} setUser={setUser} />}
          />
          <Route
            path="/admin/category/recycle"
            element={<RecycleCategoty user={user} setUser={setUser} />}
          />
        </Route>

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
