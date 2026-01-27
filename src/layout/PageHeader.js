import React from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function PageHeader({ title, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await api.post(
        "/auth/logout",
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
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default PageHeader;
