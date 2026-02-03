import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function AddColor({ user, setUser }) {
  const navigate = useNavigate();
  const [code, setCode] = useState("#");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await api.post("/meta/colors", { code });
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "ไม่สามารถเพิ่มสีได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <PageHeader title="Add Color Category" setUser={setUser} />
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded shadow p-6 space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">Color Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="#22c55e"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-green-300"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              รูปแบบ: #RGB หรือ #RRGGBB
            </p>
          </div>

          {/* Preview */}
          <div>
            <label className="block font-medium mb-1">Preview</label>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded border"
                style={{ backgroundColor: code }}
              />
              <span className="text-gray-600">{code}</span>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/color/all")}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddColor;
