import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";

function Projects({ user, setUser }) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [pins, setPins] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500 font-semibold";
      case "pending":
        return "text-yellow-500 font-semibold";
      case "rejected":
        return "text-red-500 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const projectRes = await api.get("/project/all", {
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
      const res = await api.get(`/projects/${projectId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      const res = await api.get(`/projects/${projectId}/pins`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          category_id: category || undefined,
        },
      });
      console.log(res.data);
      setPins(res.data.pins);
      setCategories(res.data.categories);
      setSelectedProject(projectId);
      setMembers([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="All Project" setUser={setUser} />

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
                    <button
                      onClick={async () => {
                        if (!window.confirm(`ยืนยันลบโปรเจค ${project.name}?`))
                          return;

                        const token = localStorage.getItem("token");

                        try {
                          await api.delete(`/project/${project.id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                          });

                          setProjects((prev) =>
                            prev.filter((p) => p.id !== project.id),
                          );
                        } catch (err) {
                          alert("ลบโปรเจคไม่สำเร็จ");
                          console.error(err);
                        }
                      }}
                      className="text-red-500 hover:underline font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
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
                {categories.filter(Boolean).map((c) => (
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
                  <p className="font-medium">{pin.title}</p>
                  <p className="text-gray-500 text-sm">{pin.description}</p>
                  <p className="text-gray-600 text-sm">
                    Status:{" "}
                    <span className={getStatusStyle(pin.status)}>
                      {pin.status}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Project: {pin.project.name}
                  </p>
                  {pin.category != null ? (
                    <p className="text-sm text-gray-500">
                      Category: {pin.category.name_th} / {pin.category.name_en}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Category:{" "}
                      <span className="text-red-500">Category has Deleted</span>
                    </p>
                  )}
                  {pin.creator != null ? (
                    <p className="text-sm text-gray-500">
                      Creator: {pin.creator?.name} (
                      <span>{pin.creator.email}</span>)
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Creator:{" "}
                      <span className="text-red-500">User has Deleted</span>
                    </p>
                  )}
                  {pin.approver != null ? (
                    <p className="text-sm text-gray-500">
                      Approver: {pin.approver?.name} (
                      <span>{pin.approver.email}</span>)
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Approver:{" "}
                      <span className="text-red-500">User has Deleted</span>
                    </p>
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
      </div>
    </div>
  );
}

export default Projects;
