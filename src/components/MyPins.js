import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyPins({ user, setUser }) {
  const [approvedPins, setApprovedPins] = useState([]);
  const [pendingPins, setPendingPins] = useState([]);
  const [rejectedPins, setRejectedPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [rejectedProjects, setRejectedProjects] = useState([]);
  const [approvedCategories, setApprovedCategories] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [rejectedCategories, setRejectedCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAllPins = async () => {
      const token = localStorage.getItem("token");

      try {
        const [approvedRes, pendingRes, rejectedRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/pins/approved", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/pins/pending", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/pins/rejected", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log(pendingRes.data);
        setApprovedPins(approvedRes.data.pins);
        setPendingPins(pendingRes.data.pins);
        setRejectedPins(rejectedRes.data.pins);
        setApprovedProjects(approvedRes.data.projects);
        setPendingProjects(pendingRes.data.projects);
        setRejectedProjects(rejectedRes.data.projects);
        setApprovedCategories(approvedRes.data.categories);
        setPendingCategories(pendingRes.data.categories);
        setRejectedCategories(rejectedRes.data.categories);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPins();
  }, [user, navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  const renderPins = (pins) =>
    pins.length > 0 ? (
      <ul className="space-y-4">
        {pins.map((pin) => (
          <li key={pin.id} className="p-4 bg-white rounded shadow">
            <h3
              onClick={() => navigate(`/pins/${pin.id}`)}
              className="text-lg font-semibold cursor-pointer"
            >
              {pin.title}
            </h3>
            {/* <p className="text-gray-600">{pin.description}</p> */}
            <p className="text-sm text-gray-500">
              Project: {pin.project?.name ?? "-"}
            </p>
            <p className="text-sm text-gray-500">Status: {pin.status}</p>
            <p className="text-sm text-gray-500">
              Category EN: {pin.category?.name_en ?? "-"}
            </p>
            <p className="text-sm text-gray-500">
              Category TH: {pin.category?.name_th ?? "-"}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-400">ไม่มีข้อมูล</p>
    );

  const renderCategoryDropdown = (categories) => {
    return (
      <select className="border rounded p-1 mb-4">
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name_th} / {cat.name_en}
          </option>
        ))}
      </select>
    );
  };

  const renderProjectDropdown = (projects) => {
    return (
      <select className="border rounded p-1 mb-4">
        <option value="">All Projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">My Pins</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div
              onClick={() => navigate("/pins/create")}
              className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-6 rounded-lg shadow-md text-lg text-center"
            >
              + Add Pin
            </div>
            {/* Approved */}
            <div className="my-8">
              <div className="flex justify-between">
                <h3 className="text-xl font-bold mb-3 text-green-600">
                  Approved
                </h3>
                <div className="flex gap-4">
                  {renderProjectDropdown(approvedProjects)}
                  {renderCategoryDropdown(approvedCategories)}
                </div>
              </div>
              {renderPins(approvedPins)}
            </div>

            {/* Pending */}
            <div className="mb-8">
              <div className="flex justify-between">
                <h3 className="text-xl font-bold mb-3 text-yellow-500">
                  Pending
                </h3>
                <div className="flex gap-4">
                  {renderProjectDropdown(pendingProjects)}
                  {renderCategoryDropdown(pendingCategories)}
                </div>
              </div>
              {renderPins(pendingPins)}
            </div>

            {/* Rejected */}
            <div className="mb-8">
              <div className="flex justify-between">
                <h3 className="text-xl font-bold mb-3 text-red-500">
                  Rejected
                </h3>
                <div className="flex gap-4">
                  {renderProjectDropdown(rejectedProjects)}
                  {renderCategoryDropdown(rejectedCategories)}
                </div>
              </div>
              {renderPins(rejectedPins)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyPins;
