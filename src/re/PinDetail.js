import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function PinDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPin = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/pins/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPin(res.data.pin);
      } catch (err) {
        console.log(err);
        alert("ไม่พบข้อมูล Pin");
        navigate("/my-pins");
      } finally {
        setLoading(false);
      }
    };

    fetchPin();
  }, [id, user, navigate]);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!pin) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <button onClick={() => navigate(-1)} className="text-blue-500 mb-4">
          ← กลับ
        </button>

        <h2 className="text-2xl font-bold mb-4">{pin.title}</h2>

        <p>
          <b>Code:</b> {pin.code}
        </p>
        <p>
          <b>Description:</b> {pin.description ?? "-"}
        </p>
        <p>
          <b>Status:</b> {pin.status}
        </p>

        <hr className="my-4" />

        <p>
          <b>Project:</b> {pin.project?.name ?? "-"}
        </p>
        <p>
          <b>Category:</b> {pin.category?.name_th} / {pin.category?.name_en}
        </p>

        <hr className="my-4" />

        <p>
          <b>Latitude:</b> {pin.lat}
        </p>
        <p>
          <b>Longitude:</b> {pin.lng}
        </p>
        <p>
          <b>Address:</b> {pin.address_text ?? "-"}
        </p>

        <hr className="my-4" />

        <p>
          <b>Created at:</b> {pin.created_at}
        </p>
        <p>
          <b>Approved at:</b> {pin.approved_at ?? "-"}
        </p>

        {pin.reject_reason && (
          <p className="text-red-500 mt-2">
            <b>Reject reason:</b> {pin.reject_reason}
          </p>
        )}
      </div>
    </div>
  );
}

export default PinDetail;
