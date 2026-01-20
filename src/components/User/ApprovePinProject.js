import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function ApprovePinProject({ user, setUser }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [pins, setPins] = useState([]);
  const [categories, setCategories] = useState([]);

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
        const res = await api.get(`/projects/${projectId}/pins`, {
          params: {
            category_id: categoryId || undefined,
          },
        });
        setPins(res.data.pins);
        setCategories(res.data.categories);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, [user, projectId, categoryId, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Approved Pin in Project" setUser={setUser} />

        <div className="bg-white p-4 rounded shadow my-6 flex gap-4">
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
                onClick={() =>
                  navigate(`/projects/${projectId}/pins/${pin.id}`)
                }
                className="bg-white p-4 rounded shadow hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold">{pin.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{pin.description}</p>

                <div className="mt-3 text-sm text-gray-500">
                  <div>
                    Status:{" "}
                    <span className={getStatusStyle(pin.status)}>
                      {pin.status ?? "-"}
                    </span>
                  </div>
                  <div>Category: {pin.category?.name_th ?? "-"}</div>
                  <div>
                    Create By: {pin.creator.name ?? "-"} (
                    <span className="text-gray-500">{pin.creator.email}</span>)
                  </div>
                  <div>
                    Approve By: {pin.approver.name ?? "-"} (
                    <span className="text-gray-500">{pin.approver.email}</span>)
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
      </div>
    </div>
  );
}

export default ApprovePinProject;
