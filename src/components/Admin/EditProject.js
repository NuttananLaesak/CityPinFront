import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProject({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProject = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/project/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(res.data.project.name);
        setDescription(res.data.project.description || "");
      } catch (err) {
        console.error(err);
        setMessage("ไม่สามารถโหลดข้อมูลโปรเจคได้");
      }
    };

    fetchProject();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/project/${id}`,
        {
          name,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("อัปเดตโปรเจคสำเร็จ ✅");
      setTimeout(() => navigate("/admin/project/manage"), 500);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("เกิดข้อผิดพลาดในการอัปเดตโปรเจค");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Project</h2>

        {message && (
          <p className="mb-4 text-center text-sm text-green-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">ชื่อโปรเจค</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">คำอธิบาย</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
          >
            {loading ? "Updating..." : "Update Project"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/project/manage")}
            className="w-full border py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
