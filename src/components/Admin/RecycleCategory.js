import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Categories({ user, setUser }) {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/categories/recycle",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const categories = res.data.categories;

      setAllCategories(categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const renderCategoryList = (categories) => (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="p-2 bg-white rounded shadow flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            {cat.icon && (
              <img src={cat.icon} alt={cat.name_th} className="w-6 h-6" />
            )}
            <div>
              <div className="font-semibold">
                {cat.name_th} / {cat.name_en}
              </div>
              <div className="text-sm text-gray-500">
                Active: {cat.is_active ? "Yes" : "No"}
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              if (!window.confirm(`ต้องการกู้คืนหมวดหมู่ ${cat.name_th}?`))
                return;

              try {
                await api.post(`/categories/${cat.id}/restore`);
                setAllCategories((prev) => prev.filter((c) => c.id !== cat.id));
              } catch (err) {
                alert("กู้คืนหมวดหมู่ไม่สำเร็จ");
                console.error(err);
              }
            }}
            className="text-green-500 hover:underline font-medium"
          >
            Restore
          </button>
        </li>
      ))}
    </ul>
  );

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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Recycle Category</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Log Out
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold mb-4">All Categories</h2>
              {renderCategoryList(allCategories)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Categories;
