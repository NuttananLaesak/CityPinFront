import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditCategoryForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [icon, setIcon] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCategory = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/categories/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const category = res.data.category;

        setNameTh(category.name_th);
        setNameEn(category.name_en);
        setIcon(category.icon || "");
        setIsActive(category.is_active);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load category");
      }
    };

    fetchCategory();
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `http://127.0.0.1:8000/api/categories/${id}`,
        {
          name_th: nameTh,
          name_en: nameEn,
          icon: icon,
          is_active: isActive,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessage("Category updated successfully");
      // กลับไปหน้า list
      console.log("Update response:", res.data);
      navigate(-1);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name (TH)</label>
          <input
            type="text"
            value={nameTh}
            onChange={(e) => setNameTh(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Name (EN)</label>
          <input
            type="text"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Icon URL</label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            id="isActive"
          />
          <label htmlFor="isActive">Active</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>
      </form>
    </div>
  );
}

export default EditCategoryForm;
