import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function ColorList({ user, setUser }) {
  const navigate = useNavigate();
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchColors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/meta/colors");
      setColors(res.data.colors);
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
    fetchColors();
  }, [user, navigate, fetchColors]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="All Color Categories" setUser={setUser} />

        <div
          onClick={() => navigate("/admin/category/colors/add")}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold mb-5 py-3 px-6 rounded-lg shadow-md text-lg text-center"
        >
          + Add Color
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">ID</th>
                <th className="p-3 border text-left">Preview</th>
                <th className="p-3 border text-left">Color Code</th>
              </tr>
            </thead>
            <tbody>
              {colors.length > 0 ? (
                colors.map((color) => (
                  <tr key={color.id}>
                    <td className="p-3 border">{color.id}</td>
                    <td className="p-3 border">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: color.code }}
                      />
                    </td>
                    <td className="p-3 border text-gray-600">{color.code}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    ยังไม่มี Color
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

export default ColorList;
