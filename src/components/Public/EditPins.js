import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function EditPin({ user }) {
  const { projectId, id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [images, setImages] = useState([]); // รูปเดิม
  const [newImages, setNewImages] = useState([]); // รูปที่เพิ่มใหม่
  const [deletedImages, setDeletedImages] = useState([]); // id รูปที่จะลบ
  const [categories, setCategories] = useState([]);

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

  // 🔹 load pin + categories
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [pinRes, catRes] = await Promise.all([
          api.get(`projects/${projectId}/pins/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`projects/${projectId}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const p = pinRes.data.pin;
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
        setImages(p.images || []);
        setCategories(catRes.data.categories || []);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, projectId, user, navigate, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // field ปกติ
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    // รูปใหม่
    newImages.forEach((file) => {
      formData.append("images[]", file);
    });

    // id รูปที่ลบ
    deletedImages.forEach((imgId) => {
      formData.append("deleted_images[]", imgId);
    });

    try {
      await api.post(`/pins/${id}?_method=PUT`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("แก้ไข Pin สำเร็จ");
      navigate(-1);
    } catch (err) {
      alert("แก้ไขไม่สำเร็จ");
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
          {/* Code */}
          <div className="font-semibold">Code</div>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Title */}
          <div className="font-semibold">Title</div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Description */}
          <div className="font-semibold">Description</div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* Category */}
          <div className="font-semibold">Category</div>
          <div className="border rounded divide-y overflow-visible">
            {categories.map((c) => {
              const selected = Number(form.category_id) === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setForm({ ...form, category_id: c.id })}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer
          transition-transform duration-150
          ${selected ? "scale-105 shadow-md z-10" : "scale-100"}`}
                  style={{
                    backgroundColor: c.color?.code || "#ffffff",
                    opacity: selected ? 1 : 0.65,
                  }}
                >
                  {c.icon?.path && (
                    <img
                      src={c.icon.path}
                      alt={c.name_en}
                      className="w-5 h-5"
                    />
                  )}
                  <span className="text-white font-medium">
                    {c.name_th} / {c.name_en}
                  </span>
                  {selected && (
                    <span className="ml-auto text-white font-bold">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lat Lng */}
          <div className="font-semibold">Lat, Lng</div>
          <div className="flex gap-2">
            <input
              name="lat"
              value={form.lat}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              name="lng"
              value={form.lng}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Address */}
          <div className="font-semibold">Address</div>
          <input
            name="address_text"
            value={form.address_text}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {/* New Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setNewImages([...newImages, ...Array.from(e.target.files)])
            }
          />

          {newImages.length > 0 && (
            <>
              <div className="font-semibold">New Images</div>
              <div className="grid grid-cols-3 gap-3">
                {newImages.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    className="h-24 w-full object-cover rounded"
                    alt=""
                  />
                ))}
              </div>
            </>
          )}

          {/* Old Images */}
          {images.length > 0 && (
            <>
              <div className="font-semibold">Old Images</div>
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={`http://127.0.0.1:8000/storage/${img.path}`}
                      className="h-24 w-full object-cover rounded"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(images.filter((i) => i.id !== img.id));
                        setDeletedImages([...deletedImages, img.id]);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

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
