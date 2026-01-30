import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function ApprovePinProject({ user, setUser }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [pins, setPins] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔹 reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "text-green-500 font-semibold";
      case "pending":
        return "text-yellow-500 font-semibold";
      case "rejected":
        return "text-red-500 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  // 🔹 fetch pins (ย้ายออกจาก useEffect)
  const fetchPins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/pins/all`, {
        params: {
          status: status || undefined,
          category_id: categoryId || undefined,
        },
      });

      setPins(res.data.pins);
      setStatuses(res.data.statuses);
      setCategories(res.data.categories);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [projectId, status, categoryId]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPins();
  }, [user, navigate, fetchPins]);

  // 🔹 approve
  const approvePin = async (pinId) => {
    try {
      await api.post(`/pins/${pinId}/approve`);
      alert("Approve สำเร็จ");
      fetchPins();
    } catch (err) {
      alert(err.response?.data?.message || "Approve ไม่สำเร็จ");
    }
  };

  // 🔹 reject
  const openRejectModal = (pinId) => {
    setSelectedPinId(pinId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const rejectPin = async () => {
    if (!rejectReason.trim()) {
      alert("กรุณากรอกเหตุผล");
      return;
    }

    try {
      await api.post(`/pins/${selectedPinId}/reject`, {
        reject_reason: rejectReason,
      });
      alert("Reject สำเร็จ");
      setShowRejectModal(false);
      fetchPins();
    } catch (err) {
      alert(err.response?.data?.message || "Reject ไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Manage Project" setUser={setUser} />

        {/* 🔹 filters */}
        <div className="bg-white p-4 rounded shadow my-6 flex gap-4">
          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.filter(Boolean).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_th} / {c.name_en}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setStatus("");
              setCategoryId("");
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Clear
          </button>
        </div>

        {/* 🔹 list */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pins.map((pin) => (
              <div
                key={pin.id}
                onClick={() =>
                  navigate(`/projects/${projectId}/pins/${pin.id}`)
                }
                className="bg-white p-4 rounded shadow hover:bg-gray-50 transition"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{pin.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {pin.description}
                    </p>

                    <div className="mt-3 text-sm text-gray-500">
                      <div>
                        Status:{" "}
                        <span className={getStatusStyle(pin.status)}>
                          {pin.status}
                        </span>
                      </div>
                      <div>Category: {pin.category?.name_th ?? "-"}</div>
                      <div>
                        Create By: {pin.creator?.name ?? "-"} (
                        {pin.creator?.email ?? "-"})
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 mt-3">
                    {pin.status === "pending" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            approvePin(pin.id);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRejectModal(pin.id);
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${projectId}/pins/${pin.id}/edit`);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            ยังไม่มี Pin ใน Project นี้
          </p>
        )}

        {/* 🔹 reject modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
              <h3 className="font-semibold mb-3">Reject Pin</h3>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                rows={4}
                placeholder="กรอกเหตุผลที่ reject"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="border px-3 py-1 rounded"
                >
                  ยกเลิก
                </button>

                <button
                  onClick={rejectPin}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovePinProject;
