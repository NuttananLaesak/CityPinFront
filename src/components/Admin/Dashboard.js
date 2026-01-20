import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard({ user, setUser }) {
  const [, setUserData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const userRes = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(userRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 text-center gap-4">
          <div
            onClick={() => navigate("/admin/category/all")}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">Category</h3>
          </div>
          <div
            onClick={() => navigate("/admin/project/all")}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">Projects</h3>
          </div>
          <div
            onClick={() => navigate("/admin/pin/all")}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">All Pins</h3>
          </div>
          <div
            onClick={() => navigate("/admin/project/manage")}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">Manage Project</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
