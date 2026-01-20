import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ManageProjects({ user, setUser }) {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [pins, setPins] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  // สำหรับ dropdown
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  // modal เพิ่มสมาชิก
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberUserId, setMemberUserId] = useState("");
  const [memberRoleId, setMemberRoleId] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedPinId, setSelectedPinId] = useState(null);

  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const userRes = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(userRes.data);

        const projectUrl = userRes.data.is_admin
          ? "http://127.0.0.1:8000/api/project/all"
          : "http://127.0.0.1:8000/api/project";

        const projectRes = await axios.get(projectUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectRes.data.projects);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  // ฟังก์ชันเรียกสมาชิก
  const fetchMembers = async (projectId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/projects/${projectId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMembers(res.data.members);
      setSelectedProject(projectId);
      setPins([]); // ซ่อน pins ตอนดูสมาชิก
    } catch (err) {
      console.log(err);
    }
  };

  // ฟังก์ชันเรียก pins
  const fetchPins = async (
    projectId,
    status = selectedStatus,
    categoryId = selectedCategory
  ) => {
    const token = localStorage.getItem("token");

    const params = {};
    if (status) params.status = status;
    if (categoryId) params.category_id = categoryId;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/projects/${projectId}/pins/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setPins(res.data.pins);
      setStatuses(res.data.statuses || []);
      setCategories(res.data.categories || []);

      setSelectedProject(projectId);
      setMembers([]);
    } catch (err) {
      console.log(err);
    }
  };

  const openAddMember = async (projectId) => {
    const token = localStorage.getItem("token");

    setSelectedProject(projectId);
    setShowAddMember(true);

    try {
      const [userRes, roleRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(userRes.data.users);
      setRoles(roleRes.data.roles);
    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลผู้ใช้หรือ role ไม่สำเร็จ");
    }
  };

  const addMember = async () => {
    if (!memberUserId || !memberRoleId) {
      alert("กรุณาเลือกผู้ใช้และ role");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/projects/${selectedProject}/members`,
        {
          user_id: memberUserId,
          role_id: memberRoleId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("เพิ่มสมาชิกสำเร็จ");
      setShowAddMember(false);
      setMemberUserId("");
      setMemberRoleId("");
      fetchMembers(selectedProject);
    } catch (err) {
      alert(err.response?.data?.message || "เพิ่มสมาชิกไม่สำเร็จ");
    }
  };

  const approvePin = async (pinId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/pins/${pinId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Approve สำเร็จ");
      fetchPins(selectedProject);
    } catch (err) {
      alert(err.response?.data?.message || "Approve ไม่สำเร็จ");
    }
  };

  const openRejectModal = (pinId) => {
    setSelectedPinId(pinId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const rejectPin = async () => {
    if (!rejectReason.trim()) {
      alert("กรุณากรอกเหตุผล");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/pins/${selectedPinId}/reject`,
        { reject_reason: rejectReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Reject สำเร็จ");
      setShowRejectModal(false);
      fetchPins(selectedProject);
    } catch (err) {
      alert(err.response?.data?.message || "Reject ไม่สำเร็จ");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Manage Projects</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        <div
          onClick={() => navigate("/projects/create")}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-6 rounded-lg shadow-md text-lg text-center"
        >
          + Add Project
        </div>

        {/* User Info */}
        <div className="my-6 p-4 bg-white rounded shadow">
          {userData ? (
            <p className="text-lg font-medium text-gray-700">
              Welcome, <span className="font-bold">{userData.name}</span>
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Projects List */}
        <div className="mb-6">
          {projects.length > 0 ? (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="p-4 bg-white rounded shadow flex justify-between items-center"
                >
                  <div>
                    <strong className="text-gray-800">{project.name}</strong>
                    {!userData.is_admin && (
                      <span className="text-gray-500 ml-2">
                        — Role: {project.role_name}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {(userData.is_admin || project.role_name === "Manager") && (
                      <button
                        onClick={() => openAddMember(project.id)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        เพิ่มสมาชิก
                      </button>
                    )}

                    <button
                      onClick={() => fetchMembers(project.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      ดูสมาชิก
                    </button>

                    <button
                      onClick={() => fetchPins(project.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      ดู Pins
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/project/edit/${project.id}`)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No projects assigned.</p>
          )}
        </div>

        {/* Members List */}
        {selectedProject && members.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded shadow">
            <h3 className="text-xl font-semibold mb-3">สมาชิกในโปรเจค</h3>
            <ul className="space-y-2">
              {members.map((m) => (
                <li
                  key={m.user_id}
                  className="p-2 border rounded flex justify-between"
                >
                  <div>
                    <span className="font-medium">{m.name}</span> (
                    <span className="text-gray-500">{m.email}</span>)
                  </div>
                  <span className="text-sm text-gray-600">{m.role_name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pins List */}
        {selectedProject && pins.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded shadow">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-3">Pins ในโปรเจค</h3>
              <div className="flex gap-4">
                <select
                  className="border p-2 rounded"
                  value={selectedStatus}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedStatus(value);
                    fetchPins(selectedProject, value, selectedCategory);
                  }}
                >
                  <option value="">All Status</option>
                  {statuses.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-2 rounded"
                  value={selectedCategory}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedCategory(value);
                    fetchPins(selectedProject, selectedStatus, value);
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_th} / {c.name_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ul className="space-y-2">
              {pins.map((pin) => (
                <li
                  key={pin.id}
                  className="p-4 border rounded flex justify-between items-center"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{pin.title}</span>
                    <span className="text-gray-500 text-sm">
                      {pin.description}
                    </span>
                    <span className="text-gray-600 text-sm">
                      Status: {pin.status}
                    </span>
                    <span className="text-gray-600 text-sm">
                      Category ID: {pin.category_id}
                    </span>
                    <span className="text-gray-600 text-sm">
                      Lat: {pin.lat}, Lng: {pin.lng}
                    </span>
                  </div>
                  {pin.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approvePin(pin.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => openRejectModal(pin.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedProject && members.length === 0 && pins.length === 0 && (
          <p className="text-gray-500">
            ไม่มีข้อมูลสมาชิกหรือ Pins ในโปรเจคนี้
          </p>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h3 className="font-semibold mb-3">Reject Pin</h3>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                rows={4}
                placeholder="กรอกเหตุผลที่ reject"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="border px-3 py-1 rounded"
                >
                  ยกเลิก
                </button>

                <button
                  onClick={rejectPin}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddMember && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h3 className="font-semibold mb-4">เพิ่มสมาชิก</h3>

              {/* USER */}
              <select
                value={memberUserId}
                onChange={(e) => setMemberUserId(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-3"
              >
                <option value="">เลือกผู้ใช้</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              {/* ROLE */}
              <select
                value={memberRoleId}
                onChange={(e) => setMemberRoleId(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-4"
              >
                <option value="">เลือก Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddMember(false)}
                  className="border px-3 py-1 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addMember}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProjects;
