import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function IconList({ user, setUser }) {
  const navigate = useNavigate();
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIcons = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/meta/icons");
      setIcons(res.data.icons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchIcons();
  }, [user, navigate, fetchIcons]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <PageHeader title="All Icon Categories" setUser={setUser} />

        <div
          onClick={() => navigate("/admin/category/icons/add")}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold mb-5 py-3 px-6 rounded-lg shadow-md text-lg text-center"
        >
          + Add Icon
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">ID</th>
                <th className="p-3 border text-left">Preview</th>
                <th className="p-3 border text-left">Path</th>
              </tr>
            </thead>
            <tbody>
              {icons.length > 0 ? (
                icons.map((icon) => (
                  <tr key={icon.id}>
                    <td className="p-3 border">{icon.id}</td>
                    <td className="p-3 border">
                      <img src={icon.path} alt="icon" className="w-6 h-6" />
                    </td>
                    <td className="p-3 border text-gray-600">{icon.path}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    ยังไม่มี Icon
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IconList;
