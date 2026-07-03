import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import api, { API_BASE } from "../../services/api";
import toast from "react-hot-toast";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusColor(status) {
  if (status === "Resolved") return "green";
  if (status === "In Progress") return "blue";
  return "yellow";
}

function priorityColor(priority) {
  if (priority === "High") return "red";
  if (priority === "Medium") return "orange";
  return "green";
}

function ComplaintDetails() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || pathname.startsWith("/admin");
  const backPath = isAdmin ? "/admin/complaints" : "/resident/complaints";
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to load complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="form-card text-center py-16 text-slate-500">
          Loading complaint details...
        </div>
      </MainLayout>
    );
  }

  if (!complaint) {
    return (
      <MainLayout>
        <div className="form-card text-center py-16">
          <p className="text-slate-500 mb-4">Complaint not found.</p>
          <Link
            to={backPath}
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Back to {isAdmin ? "Manage Complaints" : "My Complaints"}
          </Link>
        </div>
      </MainLayout>
    );
  }

  const history = [...(complaint.history || [])].reverse();

  return (
    <MainLayout>
      <PageHeader
        title="Complaint Details"
        subtitle="View complete complaint information and status history."
      />

      <Link
        to={backPath}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to {isAdmin ? "Manage Complaints" : "My Complaints"}
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="form-card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {complaint.title}
              </h2>

              <div className="flex flex-wrap gap-2">
                <Badge color={statusColor(complaint.status)}>
                  {complaint.status}
                </Badge>
                <Badge color={priorityColor(complaint.priority)}>
                  {complaint.priority} Priority
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
              <span>Category: {complaint.category}</span>
              <span>Filed: {formatDate(complaint.createdAt)}</span>
              {complaint.overdue && (
                <Badge color="red">Overdue</Badge>
              )}
            </div>

            <div>
              <h3 className="form-label">Description</h3>
              <p className="text-slate-700 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {complaint.photo && (
              <div className="mt-6">
                <h3 className="form-label">Attached Photo</h3>
                <img
                  src={`${API_BASE}${complaint.photo}`}
                  alt={complaint.title}
                  className="max-w-md w-full rounded-xl border border-slate-200 object-cover"
                />
              </div>
            )}
          </div>

          <div className="form-card">
            <h3 className="text-xl font-semibold text-slate-800 mb-6">
              Status History
            </h3>

            {history.length === 0 ? (
              <p className="text-slate-500">No status changes recorded.</p>
            ) : (
              <div className="space-y-0">
                {history.map((entry, index) => (
                  <div
                    key={index}
                    className="timeline-item"
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge color={statusColor(entry.status)}>
                        {entry.status}
                      </Badge>
                      <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(entry.changedAt)}
                      </span>
                    </div>

                    {entry.note && (
                      <p className="text-sm text-slate-600 mt-1">
                        {entry.note}
                      </p>
                    )}

                    {entry.changedBy?.name && (
                      <p className="text-xs text-slate-400 mt-1">
                        Updated by {entry.changedBy.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-card h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Summary
          </h3>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-slate-400">Status</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {complaint.status}
              </dd>
            </div>

            <div>
              <dt className="text-slate-400">Priority</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {complaint.priority}
              </dd>
            </div>

            <div>
              <dt className="text-slate-400">Category</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {complaint.category}
              </dd>
            </div>

            <div>
              <dt className="text-slate-400">Submitted</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {formatDate(complaint.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="text-slate-400">Last Updated</dt>
              <dd className="font-semibold text-slate-800 mt-1">
                {formatDate(complaint.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </MainLayout>
  );
}

export default ComplaintDetails;
