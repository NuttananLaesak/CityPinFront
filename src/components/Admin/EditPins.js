import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPin({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    lat: "",
    lng: "",
    address_text: "",
    project_id: "",
    category_id: "",
  });

  const [loading, setLoading] = useState(true);

  // 🔹 load pin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/pins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const p = res.data.pin;
        setForm({
          code: p.code,
          title: p.title,
          description: p.description ?? "",
          lat: p.lat,
          lng: p.lng,
          address_text: p.address_text ?? "",
          project_id: p.project_id ?? "",
          category_id: p.category_id ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [id, user, navigate, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/pins/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("แก้ไข Pin สำเร็จ");
      navigate(-1);
    } catch (err) {
      alert(err.response?.data?.message || "แก้ไขไม่สำเร็จ");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Edit Pin</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className=" font-semibold">Code</div>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Code"
          />
          <div className=" font-semibold">Title</div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Title"
          />
          <div className=" font-semibold">Description</div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Description"
          />
          <div className="font-semibold">Lat,Lng</div>
          <div className="flex gap-2">
            <input
              name="lat"
              value={form.lat}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Latitude"
            />
            <input
              name="lng"
              value={form.lng}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Longitude"
            />
          </div>
          <div className="font-semibold">Address</div>
          <input
            name="address_text"
            value={form.address_text}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Address"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border px-4 py-2 rounded"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPin;
