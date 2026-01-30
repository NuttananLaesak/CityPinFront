import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function ProjectMembers({ user, setUser }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [myRole, setMyRole] = useState(null);
  const [members, setMembers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);

  // add member modal
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberUserId, setMemberUserId] = useState("");
  const [memberRoleId, setMemberRoleId] = useState("");

  // change role
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRoleId, setNewRoleId] = useState("");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const isManager = myRole === "manager" || myRole === "Manager";

  // 🔹 fetch members
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/members`);
      setMembers(res.data.members);
      setMyRole(res.data.user.role);
      setProjectName(res.data.project_name);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 🔹 fetch roles (🔥 FIX)
  const fetchRoles = useCallback(async () => {
    try {
      const res = await api.get(`/projects/available-roles`);
      setRoles(res.data.roles);
    } catch (err) {
      console.error("โหลด roles ไม่สำเร็จ");
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMembers();
    fetchRoles(); // 🔥 load roles ตั้งแต่แรก
  }, [user, navigate, fetchMembers, fetchRoles]);

  // 🔹 open modal
  const openAddMember = async () => {
    try {
      setShowAddMember(true);
      const userRes = await api.get(`/projects/${projectId}/available-users`);
      setUsers(userRes.data.users);
    } catch (err) {
      alert("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  // 🔹 add member
  const addMember = async () => {
    if (!memberUserId || !memberRoleId) {
      alert("กรุณาเลือกผู้ใช้และ role");
      return;
    }

    try {
      await api.post(`/projects/${projectId}/members`, {
        user_id: memberUserId,
        role_id: memberRoleId,
      });

      alert("เพิ่มสมาชิกสำเร็จ");
      setShowAddMember(false);
      setMemberUserId("");
      setMemberRoleId("");
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "เพิ่มสมาชิกไม่สำเร็จ");
    }
  };

  // 🔹 change role
  const changeRole = async (userId) => {
    if (!newRoleId) {
      alert("กรุณาเลือก role");
      return;
    }

    try {
      await api.put(`/projects/${projectId}/member/role`, {
        user_id: userId,
        role_id: newRoleId,
      });

      alert("เปลี่ยน role สำเร็จ");
      setEditingUserId(null);
      setNewRoleId("");
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "เปลี่ยน role ไม่สำเร็จ");
    }
  };

  // 🔹 kick member
  const kickMember = async (userId) => {
    if (!window.confirm("คุณต้องการลบสมาชิกคนนี้ออกจากโปรเจคหรือไม่?")) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}/member/${userId}`);
      alert("ลบสมาชิกสำเร็จ");
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || "ลบสมาชิกไม่สำเร็จ");
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
      <div className="max-w-4xl mx-auto">
        <PageHeader title={`Members - ${projectName}`} setUser={setUser} />

        {isManager && (
          <div
            onClick={openAddMember}
            className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-6 mb-6 rounded-lg shadow-md text-lg text-center"
          >
            + Add Member
          </div>
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border text-left">Name</th>
                <th className="p-3 border text-left">Email</th>
                <th className="p-3 border text-left">Role</th>
                <th className="p-3 border text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.user_id}>
                  <td className="p-3 border">{m.name}</td>
                  <td className="p-3 border text-gray-600">{m.email}</td>
                  <td className="p-3 border">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {m.role_name}
                    </span>
                  </td>
                  <td className="p-3 border">
                    {isManager && user.id !== m.user_id ? (
                      <div className="flex gap-3 items-center">
                        {editingUserId === m.user_id ? (
                          <>
                            <select
                              value={newRoleId}
                              onChange={(e) => setNewRoleId(e.target.value)}
                              className="border p-1 rounded"
                            >
                              <option value="">เลือก role</option>
                              {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => changeRole(m.user_id)}
                              className="text-green-600 text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="text-gray-500 text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingUserId(m.user_id);
                              setNewRoleId(m.role_id); // 🔥 preset role เดิม
                            }}
                            className="text-blue-600 text-sm"
                          >
                            Change Role
                          </button>
                        )}

                        <button
                          onClick={() => kickMember(m.user_id)}
                          className="text-red-600 text-sm"
                        >
                          Kick
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add member modal */}
        {showAddMember && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h3 className="font-semibold mb-4">เพิ่มสมาชิก</h3>

              <select
                value={memberUserId}
                onChange={(e) => setMemberUserId(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              >
                <option value="">เลือกผู้ใช้</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>

              <select
                value={memberRoleId}
                onChange={(e) => setMemberRoleId(e.target.value)}
                className="w-full border p-2 rounded mb-4"
              >
                <option value="">เลือก Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddMember(false)}
                  className="border px-3 py-1 rounded"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addMember}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  เพิ่ม
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectMembers;
