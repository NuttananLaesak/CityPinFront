import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function MyPins({ user, setUser }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [pins, setPins] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [status, setStatus] = useState("");
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

    const fetchPins = async () => {
      try {
        setLoading(true);
        const res = await api.get("/pins", {
          params: {
            project_id: projectId,
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
    };

    fetchPins();
  }, [user, projectId, status, categoryId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="My Pins" setUser={setUser} />

        <div
          onClick={() => navigate(`/projects/${projectId}/pins/create`)}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-6 rounded-lg shadow-md text-lg text-center"
        >
          + Add Pin
        </div>

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
                  <h3 className="text-lg font-semibold">{pin.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {pin.description}
                  </p>

                  <div className="mt-3 text-sm text-gray-500">
                    <div>
                      Status:{" "}
                      <span className={getStatusStyle(pin.status)}>
                        {pin.status ?? "-"}
                      </span>
                    </div>
                    <div>Category: {pin.category?.name_th ?? "-"}</div>
                    {pin.status === "rejected" && (
                      <div className="text-red-500">
                        Reason: {pin.reject_reason || "-"}
                      </div>
                    )}
                  </div>
                </div>

                {pin.status === "pending" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pin/edit/${pin.id}`);
                    }}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            ยังไม่มี Pin ใน Project นี้
          </p>
        )}
      </div>
    </div>
  );
}

export default MyPins;
