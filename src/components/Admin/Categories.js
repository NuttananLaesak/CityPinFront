import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Categories({ user, setUser }) {
  const [allCategories, setAllCategories] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [inactiveCategories, setInactiveCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const [allRes, activeRes, inactiveRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/categories/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/categories/inactive", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log("All Categories:", allRes.data);
      setAllCategories(allRes.data.categories);
      setActiveCategories(activeRes.data.categories);
      setInactiveCategories(inactiveRes.data.categories);
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
              <img src={cat.icon.path} alt={cat.name_th} className="w-6 h-6" />
            )}
            {cat.color && (
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: cat.color.code }}
              />
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
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/category/edit/${cat.id}`)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();

                if (!window.confirm("ยืนยันลบ Pin นี้?")) return;

                try {
                  await api.delete(`/categories/${cat.id}`);
                  setAllCategories((prev) =>
                    prev.filter((c) => c.id !== cat.id),
                  );
                } catch (err) {
                  console.error(err);
                  alert("ลบไม่สำเร็จ");
                }
                fetchCategories();
              }}
              className="text-red-500 hover:underline font-medium"
            >
              Delete
            </button>
          </div>
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
    } catch (error) {
      console.log("Logout error:", error);
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
          <h2 className="text-3xl font-bold text-gray-800">Category</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
        <div
          onClick={() => navigate("/admin/category/create")}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-6 rounded-lg shadow-md text-lg text-center"
        >
          + Add Category
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

            <div>
              <h2 className="text-2xl font-bold mb-4">Active Categories</h2>
              {renderCategoryList(activeCategories)}
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Inactive Categories</h2>
              {renderCategoryList(inactiveCategories)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Categories;
