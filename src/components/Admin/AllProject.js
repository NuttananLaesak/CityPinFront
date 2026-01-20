import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Projects({ user, setUser }) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [pins, setPins] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const projectRes = await axios.get(
          "http://127.0.0.1:8000/api/project/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

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
  const fetchPins = async (projectId, category = "") => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/projects/${projectId}/pins`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            category_id: category || undefined,
          },
        }
      );

      setPins(res.data.pins);
      setCategories(res.data.categories);
      setSelectedProject(projectId);
      setMembers([]);
    } catch (err) {
      console.log(err);
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
          <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        <div
          onClick={() => navigate("/project/create")}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-6 rounded-lg shadow-md text-lg text-center"
        >
          + Add Project
        </div>

        {/* Projects List */}
        <div className="my-6">
          {projects.length > 0 ? (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="p-4 bg-white rounded shadow flex justify-between items-center"
                >
                  <div>
                    <strong className="text-gray-800">{project.name}</strong>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchMembers(project.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      ดูสมาชิก
                    </button>

                    <button
                      onClick={() => {
                        setCategoryId("");
                        fetchPins(project.id);
                      }}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      ดู Pins
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
              <select
                className="border p-2 rounded"
                value={categoryId}
                onChange={(e) => {
                  const value = e.target.value;
                  setCategoryId(value);
                  fetchPins(selectedProject, value);
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
            <ul className="space-y-2">
              {pins.map((pin) => (
                <li
                  key={pin.id}
                  className="p-2 border rounded flex flex-col gap-1"
                >
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
      </div>
    </div>
  );
}

export default Projects;
