import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AllPins({ user, setUser }) {
  const navigate = useNavigate();

  const [pins, setPins] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [status, setStatus] = useState("");
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPins();
    // eslint-disable-next-line
  }, [status, projectId, categoryId]);

  const fetchPins = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const params = {};
      if (status) params.status = status;
      if (projectId) params.project_id = projectId;
      if (categoryId) params.category_id = categoryId;

      const res = await axios.get("http://127.0.0.1:8000/api/pins/all", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setPins(res.data.pins);
      setStatuses(res.data.statuses);
      setProjects(res.data.projects);
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
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
          <h2 className="text-3xl font-bold text-gray-800">My Pins</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_th} / {c.name_en}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setStatus("");
              setProjectId("");
              setCategoryId("");
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Clear
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pins.length === 0 ? (
          <div className="text-center text-gray-400">ไม่มีข้อมูล</div>
        ) : (
          <ul className="space-y-4">
            {pins.map((pin) => (
              <li
                key={pin.id}
                className="bg-white p-4 rounded shadow cursor-pointer"
                onClick={() => navigate(`/pins/${pin.id}`)}
              >
                <h3 className="text-lg font-semibold">{pin.title}</h3>
                <p className="text-sm text-gray-500">Status: {pin.status}</p>
                <p className="text-sm text-gray-500">
                  Project: {pin.project?.name ?? "-"}
                </p>
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  {pin.category
                    ? `${pin.category.name_th} / ${pin.category.name_en}`
                    : "-"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AllPins;
