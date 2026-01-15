import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePin({ user }) {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [addressText, setAddressText] = useState("");

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // 🔹 โหลด project + category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, categoryRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/project", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/categories", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(projectRes.data.projects ?? projectRes.data);
        setCategories(categoryRes.data.categories ?? categoryRes.data);
      } catch (err) {
        console.error("Load dropdown error:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/pins",
        {
          code,
          title,
          description,
          project_id: projectId || null,
          category_id: categoryId || null,
          lat,
          lng,
          address_text: addressText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setMessage("Pin created successfully");
      setTimeout(() => navigate("/my-pins"), 300);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error creating pin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Pin</h2>

      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code */}
        <div>
          <label className="block mb-1">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Lat */}
        <div>
          <label className="block mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Lng */}
        <div>
          <label className="block mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Project dropdown */}
        <div>
          <label className="block mb-1">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- ไม่เลือก --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category dropdown */}
        <div>
          <label className="block mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- ไม่เลือก --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_th} / {c.name_en}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          {loading ? "Creating..." : "Create Pin"}
        </button>
      </form>
    </div>
  );
}

export default CreatePin;
