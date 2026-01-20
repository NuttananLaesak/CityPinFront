import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateProject({ user }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // กันคนไม่ login
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/project",
        {
          name,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Project created:", res.data);
      setMessage("สร้างโปรเจคสำเร็จ 🎉");
      setName("");
      setDescription("");

      // กลับไปหน้า projects
      navigate(-1);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("เกิดข้อผิดพลาดในการสร้างโปรเจค");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          สร้างโปรเจคใหม่
        </h2>

        {message && (
          <div className="mb-4 text-sm text-center text-green-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">ชื่อโปรเจค</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="เช่น Urban Tree Mapping"
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
              placeholder="รายละเอียดของโปรเจค (ไม่บังคับ)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            {loading ? "กำลังสร้าง..." : "สร้างโปรเจค"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full border py-2 rounded hover:bg-gray-100"
          >
            ยกเลิก
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;
