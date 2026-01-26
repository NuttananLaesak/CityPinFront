import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function RecycleRole({ user, setUser }) {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/role/recycle");
      setRoles(res.data.roles);
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
    fetchRoles();
  }, [user, navigate, fetchRoles]);

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
        <PageHeader title="Recycle Roles" setUser={setUser} />

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Name</th>
                <th className="p-3 border text-left">Status</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((r) => (
                  <tr key={r.id}>
                    <td className="p-3 border">{r.name}</td>
                    <td className="p-3 border">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          r.is_active === 1
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.is_active === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={async () => {
                          if (!window.confirm(`ต้องการกู้คืน Role ${r.name}?`))
                            return;

                          try {
                            await api.post(`/role/${r.id}/restore`);
                            setRoles((prev) =>
                              prev.filter((user) => user.id !== r.id),
                            );
                          } catch (err) {
                            alert("กู้คืนโรลไม่สำเร็จ");
                            console.error(err);
                          }
                        }}
                        className="text-green-500 hover:underline font-medium"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-gray-500">
                    ยังไม่มีบทบาท
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

export default RecycleRole;
