import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    new_password_confirmation: "",
  });

  const token = localStorage.getItem("token");

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || "",
        });
      } catch (error) {
        console.log("Fetch profile error:", error);
      }
    };

    fetchProfile();
  }, [token]);

  // ================= UPDATE PROFILE =================
  const handleUpdateProfile = async () => {
    try {
      const res = await api.put("/user/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setIsEditOpen(false);
      alert("แก้ไขข้อมูลเรียบร้อย");
    } catch (error) {
      alert("แก้ไขข้อมูลไม่สำเร็จ");
    }
  };

  // ================= CHANGE PASSWORD =================
  const handleChangePassword = async () => {
    try {
      await api.post("/auth/change-password", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("เปลี่ยนรหัสผ่านสำเร็จ กรุณา login ใหม่");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      alert("เปลี่ยนรหัสผ่านไม่สำเร็จ");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <PageHeader title="My Profile" setUser={() => {}} />

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="opacity-90">{user.email}</p>
              </div>
            </div>
          </div>

          {/* BODY */}
          <div className="p-8">
            <h3 className="text-lg font-semibold mb-6">ข้อมูลส่วนตัว</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">ชื่อ</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">อีเมล</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">เบอร์โทร</p>
                <p className="font-medium">{user.phone || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">สถานะ</p>
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                  Active
                </span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsEditOpen(true)}
                className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                แก้ไขโปรไฟล์
              </button>
              <button
                onClick={() => setIsPasswordOpen(true)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">แก้ไขข้อมูลส่วนตัว</h3>

            <div className="space-y-4">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="ชื่อ"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="อีเมล"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="เบอร์โทร"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {isPasswordOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">เปลี่ยนรหัสผ่าน</h3>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="รหัสผ่านใหม่"
                className="w-full border rounded px-3 py-2"
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="ยืนยันรหัสผ่านใหม่"
                className="w-full border rounded px-3 py-2"
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    new_password_confirmation: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsPasswordOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                เปลี่ยนรหัส
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
