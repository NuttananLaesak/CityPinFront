import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function RecycleBinPins({ user, setUser }) {
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

    const fetchRecyclePins = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/pins/recycle`, {
          params: {
            project_id: projectId || undefined,
            status: status || undefined,
            category_id: categoryId || undefined,
          },
        });
        setPins(res.data.pins);
        setProjects(res.data.projects);
        setStatuses(res.data.statuses);
        setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecyclePins();
  }, [user, projectId, status, categoryId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Recycle Bin Pins" setUser={setUser} />

        <div className="bg-white p-4 rounded shadow my-6 flex gap-4">
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
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_th} / {c.name_en}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setProjectId("");
              setStatus("");
              setCategoryId("");
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Clear
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : pins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pins.map((pin) => (
              <div
                key={pin.id}
                className="bg-white p-4 rounded shadow hover:bg-gray-50 transition flex justify-between"
              >
                <div>
                  <p className="font-medium">{pin.title}</p>
                  <p className="text-gray-500 text-sm">{pin.description}</p>
                  <p className="text-gray-600 text-sm">
                    Status:{" "}
                    <span className={getStatusStyle(pin.status)}>
                      {pin.status}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Project: {pin.project.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    Category:{" "}
                    {`${pin.category.name_th} / ${pin.category.name_th}`}
                  </p>
                  {pin.creator != null ? (
                    <p className="text-sm text-gray-500">
                      Creator: {pin.creator?.name} (
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
                      Approver: {pin.approver?.name} (
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

                <button
                  onClick={async () => {
                    if (!window.confirm("ต้องการกู้คืน Pin นี้?")) return;
                    try {
                      await api.post(`/pins/${pin.id}/restore`);
                      setPins((prev) => prev.filter((p) => p.id !== pin.id));
                    } catch {
                      alert("กู้คืนไม่สำเร็จ");
                    }
                  }}
                  className="text-green-600 hover:underline font-medium"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            ไม่มี Pin ใน Recycle Bin
          </p>
        )}
      </div>
    </div>
  );
}

export default RecycleBinPins;
