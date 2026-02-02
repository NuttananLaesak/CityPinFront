import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

function EditProject({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);

  const [icons, setIcons] = useState([]);
  const [colors, setColors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* ===============================
      load project + meta
  =============================== */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [projectRes, iconRes, colorRes] = await Promise.all([
          api.get(`/project/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/meta/icons", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/meta/colors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const project = projectRes.data.project;

        setName(project.name);
        setDescription(project.description || "");
        setCategories(project.pin_categories || []);
        setIcons(iconRes.data);
        setColors(colorRes.data);
      } catch (err) {
        console.error(err);
        setMessage("ไม่สามารถโหลดข้อมูลโปรเจคได้");
      }
    };

    fetchData();
  }, [id, user, navigate]);

  /* ===============================
      category handlers
  =============================== */
  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      { name_th: "", name_en: "", icon_id: null, color_id: null },
    ]);
  };

  const removeCategory = (index) => {
    const cat = categories[index];

    if (cat.id) {
      setDeletedCategories((prev) => [...prev, cat.id]);
    }

    setCategories(categories.filter((_, i) => i !== index));
  };

  /* ===============================
      submit
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      await api.put(
        `/project/${id}`,
        {
          name,
          description,
          categories: categories.filter(
            (c) => c.name_th?.trim() && c.name_en?.trim(),
          ),
          deleted_categories: deletedCategories,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setMessage("อัปเดตโปรเจคสำเร็จ ✅");
      navigate(-1);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("เกิดข้อผิดพลาดในการอัปเดตโปรเจค");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
      UI
  =============================== */
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">แก้ไขโปรเจค</h2>

        {message && (
          <div className="mb-4 text-center text-green-600">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* name */}
          <div>
            <label className="font-medium">ชื่อโปรเจค</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            />
          </div>

          {/* description */}
          <div>
            <label className="font-medium">คำอธิบาย</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          {/* categories */}
          <div>
            <label className="font-medium">หมวดหมู่</label>

            {categories.map((cat, index) => (
              <div
                key={cat.id || index}
                className="mt-3 p-4 border rounded bg-gray-50 space-y-3"
              >
                <input
                  placeholder="ชื่อ (TH)"
                  value={cat.name_th || ""}
                  onChange={(e) =>
                    handleCategoryChange(index, "name_th", e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                <input
                  placeholder="ชื่อ (EN)"
                  value={cat.name_en || ""}
                  onChange={(e) =>
                    handleCategoryChange(index, "name_en", e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded"
                />

                {/* ICON */}
                <div>
                  <div className="text-sm mb-1">เลือกไอคอน</div>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                      <button
                        type="button"
                        key={icon.id}
                        onClick={() =>
                          handleCategoryChange(index, "icon_id", icon.id)
                        }
                        className={`p-2 border rounded ${
                          cat.icon_id === icon.id ? "ring-2 ring-green-500" : ""
                        }`}
                      >
                        <img src={icon.path} alt="" className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* COLOR */}
                <div>
                  <div className="text-sm mb-1">เลือกสี</div>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        type="button"
                        key={color.id}
                        onClick={() =>
                          handleCategoryChange(index, "color_id", color.id)
                        }
                        className={`w-8 h-8 rounded-full border ${
                          cat.color_id === color.id ? "ring-2 ring-black" : ""
                        }`}
                        style={{ backgroundColor: color.code }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-red-500 text-sm"
                >
                  ลบหมวดนี้
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addCategory}
              className="mt-2 text-green-600 text-sm"
            >
              + เพิ่มหมวดหมู่
            </button>
          </div>

          {/* buttons */}
          <button
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 rounded"
          >
            {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full border py-2 rounded"
          >
            ยกเลิก
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
