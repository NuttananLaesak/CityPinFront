import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";

function CreatePin({ user }) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [images, setImages] = useState([]);
  const [addressText, setAddressText] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const categoryRes = await api.get(`projects/${projectId}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories(categoryRes.data.categories);
      } catch (err) {
        console.error("Load dropdown error:", err);
      }
    };

    fetchCategories();
  }, [user, token, projectId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("project_id", projectId || "");
      formData.append("category_id", categoryId || "");
      formData.append("lat", lat);
      formData.append("lng", lng);
      formData.append("address_text", addressText);
      for (let i = 0; i < images.length; i++) {
        formData.append("images[]", images[i]);
      }
      await api.post("pins", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Pin created successfully");
      navigate(-1);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error creating pin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create Pin</h2>

      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code */}
        <div>
          <label className="block mb-1">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Lat */}
        <div>
          <label className="block mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Lng */}
        <div>
          <label className="block mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Category dropdown */}
        {/* Category */}
        <div>
          <label className="block mb-1 font-semibold">Category</label>

          <div className="border rounded divide-y overflow-visible">
            {categories.map((c) => {
              const selected = Number(categoryId) === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setCategoryId(c.id)}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer
            transition-transform duration-150
            ${selected ? "scale-105 shadow-md z-10" : "scale-100"}`}
                  style={{
                    backgroundColor: c.color?.code || "#ffffff",
                    opacity: selected ? 1 : 0.65,
                  }}
                >
                  {c.icon?.path && (
                    <img
                      src={c.icon.path}
                      alt={c.name_en}
                      className="w-5 h-5"
                    />
                  )}

                  <span className="text-white font-medium">
                    {c.name_th} / {c.name_en}
                  </span>

                  {selected && (
                    <span className="ml-auto text-white font-bold">✓</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block mb-1">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setImages(files);

              const previews = files.map((file) => URL.createObjectURL(file));
              setImagePreviews(previews);
            }}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          {loading ? "Creating..." : "Create Pin"}
        </button>
      </form>

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {imagePreviews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`preview-${index}`}
              className="w-full h-24 object-cover rounded border"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CreatePin;
