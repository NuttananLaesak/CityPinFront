import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function AddIcon({ user, setUser }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("กรุณาเลือกไฟล์ Icon");
      return;
    }

    const formData = new FormData();
    formData.append("icon", file);

    try {
      setLoading(true);
      await api.post("/meta/icons", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/icon/all");
    } catch (err) {
      setError("ไม่สามารถอัปโหลด Icon ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">
        <PageHeader title="Add Icon Category" setUser={setUser} />

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <div>
            <label className="block font-medium mb-1">
              Upload Icon (svg / png / jpg)
            </label>
            <input
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block font-medium mb-1">Preview</label>
            {preview ? (
              <img src={preview} alt="preview" className="w-10 h-10" />
            ) : (
              <span className="text-gray-400 text-sm">ยังไม่มีรูป</span>
            )}
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
            >
              {loading ? "Uploading..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/icon/all")}
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

export default AddIcon;
