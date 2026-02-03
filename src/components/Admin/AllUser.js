import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function AllUser({ user, setUser }) {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/all");
      setUsers(res.data.users);
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

    if (user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchUsers();
  }, [user, navigate, fetchUsers]);

  const openModal = (u) => {
    setSelectedUser(u);
    setSelectedRole(u.role);
    setShowModal(true);
  };

  const changeRole = async () => {
    try {
      await api.put(`/user/${selectedUser.id}/role`, {
        role: selectedRole,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, role: selectedRole } : u,
        ),
      );

      setShowModal(false);
    } catch (err) {
      alert("เปลี่ยน role ไม่สำเร็จ");
      console.error(err);
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
      <div className="max-w-5xl mx-auto">
        <PageHeader title="All Users" setUser={setUser} />

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Name</th>
                <th className="p-3 border text-left">Email</th>
                <th className="p-3 border text-left">Role</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 border">{u.name}</td>
                    <td className="p-3 border text-gray-600">{u.email}</td>
                    <td className="p-3 border text-gray-600">{u.role}</td>
                    <td className="p-3 border text-center">
                      <div className="flex gap-4 justify-center">
                        {/* ห้ามแก้ role ตัวเอง */}
                        {u.id !== user.id && (
                          <button
                            onClick={() => openModal(u)}
                            className="text-yellow-500 hover:underline font-medium"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            if (!window.confirm(`ยืนยันลบผู้ใช้ ${u.name}?`))
                              return;

                            try {
                              await api.delete(`/user/${u.id}`);
                              setUsers((prev) =>
                                prev.filter((userItem) => userItem.id !== u.id),
                              );
                            } catch (err) {
                              alert("ลบผู้ใช้ไม่สำเร็จ");
                              console.error(err);
                            }
                          }}
                          className="text-red-500 hover:underline font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    ยังไม่มีผู้ใช้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 space-y-4">
            <h2 className="text-lg font-semibold">
              เปลี่ยน Role: {selectedUser?.name}
            </h2>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={changeRole}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== END MODAL ===== */}
    </div>
  );
}

export default AllUser;
