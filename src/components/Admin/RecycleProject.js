import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";

function RecycleProjects({ user, setUser }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchRecycleProjects = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await api.get("/project/recycle", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ สำคัญมาก
      }
    };

    fetchRecycleProjects();
  }, [user, navigate]);

  const handleRestore = async (project) => {
    if (!window.confirm(`ต้องการกู้คืนโปรเจค ${project.name}?`)) return;

    const token = localStorage.getItem("token");

    try {
      await api.post(
        `/project/${project.id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // เอาโปรเจคที่ restore ออกไปจาก list
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
    } catch (err) {
      alert("กู้คืนโปรเจคไม่สำเร็จ");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Recycle Project" setUser={setUser} />

        <div className="my-6">
          {/* ⏳ Loading */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* 📭 ไม่มีข้อมูล */}
          {!loading && projects.length === 0 && (
            <p className="text-center text-gray-500 mt-10">
              ไม่มีโปรเจคในถังขยะ
            </p>
          )}

          {/* ✅ มีข้อมูล */}
          {!loading && projects.length > 0 && (
            <ul className="space-y-4">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="p-4 bg-white rounded shadow flex justify-between items-center"
                >
                  <strong className="text-gray-800">{project.name}</strong>

                  <button
                    onClick={() => handleRestore(project)}
                    className="text-green-500 hover:underline font-medium"
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecycleProjects;
