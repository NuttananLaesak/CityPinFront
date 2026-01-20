import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../layout/PageHeader";

function Projects({ user, setUser }) {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProject = async () => {
      const token = localStorage.getItem("token");
      try {
        const projectRes = await api.get("/project", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projectRes.data.projects);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Projects" setUser={setUser} />

        <div
          onClick={() => navigate("/project/create")}
          className="cursor-pointer text-white bg-green-500 hover:bg-green-600 font-semibold py-3 px-6 rounded-lg shadow-md text-lg text-center"
        >
          + Add Project
        </div>

        {/* Projects List */}
        <div className="my-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/dashboard/${project.id}`)}
                  className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {project.name}
                    </h3>
                    <p className="text-gray-500 mt-2">{project.role_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Projects;
