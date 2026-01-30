import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function PinDetail({ user, setUser }) {
  const { projectId, pinId } = useParams();
  const navigate = useNavigate();

  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 font-semibold";
      case "pending":
        return "text-yellow-600 font-semibold";
      case "rejected":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPin = async () => {
      try {
        setLoading(true);
        const res = await api.get(`projects/${projectId}/pins/${pinId}`);
        console.log(res);
        setPin(res.data.pin);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPin();
  }, [user, projectId, pinId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pin) {
    return <p className="text-center text-gray-500 mt-10">ไม่พบข้อมูล Pin</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <PageHeader title="Pin Detail" setUser={setUser} />

        <div className="bg-white p-6 rounded shadow space-y-4">
          <h2 className="text-2xl font-bold">{pin.title}</h2>

          <p className="text-gray-600">{pin.description || "-"}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span className={getStatusStyle(pin.status)}>{pin.status}</span>
            </div>

            <div>
              <span className="font-semibold">Category:</span>{" "}
              {pin.category?.name_th || "-"}
            </div>

            <div>
              <span className="font-semibold">Project:</span>{" "}
              {pin.project?.name || "-"}
            </div>

            <div>
              <span className="font-semibold">Location:</span> {pin.lat},{" "}
              {pin.lng}
            </div>

            <div>
              <span className="font-semibold">Create By:</span>{" "}
              {pin.creator?.name || "-"} (
              <span className="text-gray-500">{pin.creator?.email}</span>)
            </div>

            <div>
              <span className="font-semibold">Approve By:</span>{" "}
              {pin.approver?.name || "-"} (
              <span className="text-gray-500">{pin.approver?.email}</span>)
            </div>
          </div>
          {pin.images && pin.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {pin.images.map((img) => (
                <img
                  src={`http://127.0.0.1:8000/storage/${img.path}`}
                  alt="pin"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PinDetail;
