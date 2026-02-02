import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";

function AllPins({ user, setUser }) {
  const navigate = useNavigate();

  const [pins, setPins] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);

  const [status, setStatus] = useState("");
  const [projectId, setProjectId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPins();
    // eslint-disable-next-line
  }, [status, projectId, categoryId]);

  const fetchPins = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const params = {};
      if (status) params.status = status;
      if (projectId) params.project_id = projectId;
      if (categoryId) params.category_id = categoryId;

      const res = await api.get("/pins/all", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setPins(res.data.pins);
      setStatuses(res.data.statuses);
      setProjects(res.data.projects);
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <PageHeader title="All Pins" setUser={setUser} />

        {/* Filters */}
        <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
          <select
            className="border p-2 rounded"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

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
              setProjectId("");
              setCategoryId("");
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Clear
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pins.length === 0 ? (
          <div className="text-center text-gray-400">ไม่มีข้อมูล</div>
        ) : (
          <ul className="space-y-4">
            {pins.map((pin) => (
              <li
                key={pin.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{pin.title}</h3>
                  <p>
                    Status:{" "}
                    <span className={getStatusStyle(pin.status)}>
                      {pin.status ?? "-"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Project: {pin.project?.name ?? "-"}
                  </p>
                  {pin.category != null ? (
                    <p className="text-sm text-gray-500">
                      Category: {pin.category.name_th} / {pin.category.name_en}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Category:{" "}
                      <span className="text-red-500">Category has Deleted</span>
                    </p>
                  )}

                  {pin.creator != null ? (
                    <p className="text-sm text-gray-500">
                      Creator: {pin.creator.name} (
                      <span>{pin.creator.email}</span>)
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Creator:{" "}
                      <span className="text-red-500">User has Deleted</span>
                    </p>
                  )}
                  {pin.approver != null ? (
                    <p className="text-sm text-gray-500">
                      Approver: {pin.approver.name} (
                      <span>{pin.approver.email}</span>)
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Approver:{" "}
                      <span className="text-red-500">User has Deleted</span>
                    </p>
                  )}
                  {pin.status === "rejected" && (
                    <div className="text-red-500">
                      Reason: {pin.reject_reason || "-"}
                    </div>
                  )}
                </div>

                {/* ✅ ปุ่ม Action */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/projects/${pin.project_id}/pins/${pin.id}/edit`,
                      )
                    }
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();

                      if (!window.confirm("ยืนยันลบ Pin นี้?")) return;

                      try {
                        await api.delete(`/pins/${pin.id}`);
                        setPins((prev) => prev.filter((p) => p.id !== pin.id));
                      } catch (err) {
                        console.error(err);
                        alert("ลบไม่สำเร็จ");
                      }
                    }}
                    className="text-red-500 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AllPins;
