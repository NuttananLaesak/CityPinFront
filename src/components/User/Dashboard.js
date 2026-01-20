import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import PageHeader from "../../layout/PageHeader";

function Dashboard({ user, setUser }) {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projectRole, setProjectRole] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProject = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await api.get(`/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjectRole(res.data.user.role);
        setProject(res.data.project);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [user, projectId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PageHeader title={project?.name} setUser={setUser} />

        <div className="grid grid-cols-1 md:grid-cols-2 text-center gap-4">
          <div
            onClick={() => navigate(`/projects/${projectId}/my-pins`)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">My Pin</h3>
          </div>

          <div
            onClick={() => navigate(`/projects/${projectId}/members`)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">Member</h3>
          </div>

          <div
            onClick={() =>
              navigate(`/projects/${projectId}/approve-pin-project`)
            }
            className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold">All Approve Pin Project</h3>
          </div>

          {projectRole === "Manager" && (
            <div
              onClick={() =>
                navigate(`/projects/${projectId}/manage-pin-project`)
              }
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold">Manage Project</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
