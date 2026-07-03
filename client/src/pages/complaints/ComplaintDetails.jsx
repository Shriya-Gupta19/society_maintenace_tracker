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
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    status: "",
    priority: "",
    note: "",
  });

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
      setUpdateForm({
        status: data.complaint.status,
        priority: data.complaint.priority,
        note: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to load complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();

    if (!complaint) return;

    const statusChanged = updateForm.status !== complaint.status;
    const priorityChanged = updateForm.priority !== complaint.priority;

    if (!statusChanged && !priorityChanged) {
      toast.error("No changes to save");
      return;
    }

    try {
      setUpdating(true);

      if (statusChanged) {
        await api.patch(`/admin/complaints/${id}/status`, {
          status: updateForm.status,
          note: updateForm.note.trim() || undefined,
        });
      }

      if (priorityChanged) {
        await api.patch(`/admin/complaints/${id}/priority`, {
          priority: updateForm.priority,
          note: updateForm.note.trim() || undefined,
        });
      }

      toast.success("Complaint updated");
      fetchComplaint();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to update complaint"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="form-card text-center py-16 card-muted">
          Loading complaint details...
        </div>
      </MainLayout>
    );
  }

  if (!complaint) {
    return (
      <MainLayout>
        <div className="form-card text-center py-16">
          <p className="card-muted mb-4">Complaint not found.</p>
          <Link
            to={backPath}
            className="text-blue-400 font-semibold hover:text-blue-300"
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
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to {isAdmin ? "Manage Complaints" : "My Complaints"}
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="form-card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold text-white">
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

            <div className="flex flex-wrap gap-4 text-sm card-muted mb-6">
              <span>Category: {complaint.category}</span>
              <span>Filed: {formatDate(complaint.createdAt)}</span>
              {complaint.overdue && (
                <Badge color="red">Overdue</Badge>
              )}
            </div>

            <div>
              <h3 className="form-label">Description</h3>
              <p className="card-body leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {complaint.photo && (
              <div className="mt-6">
                <h3 className="form-label">Supporting Photo</h3>
                <img
                  src={`${API_BASE}${complaint.photo}`}
                  alt={complaint.title}
                  className="max-w-md w-full rounded-xl border border-slate-600 object-cover"
                />
              </div>
            )}
          </div>

          <div className="form-card">
            <h3 className="text-xl font-semibold text-white mb-6">
              Status History
            </h3>

            {history.length === 0 ? (
              <p className="card-muted">No status changes recorded.</p>
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
                      <span className="text-xs card-muted inline-flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(entry.changedAt)}
                      </span>
                    </div>

                    {entry.note && (
                      <p className="text-sm card-body mt-1">
                        {entry.note}
                      </p>
                    )}

                    {entry.changedBy?.name && (
                      <p className="text-xs card-muted mt-1">
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
          <h3 className="text-lg font-semibold text-white mb-4">
            Summary
          </h3>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="card-muted">Status</dt>
              <dd className="font-semibold text-white mt-1">
                {complaint.status}
              </dd>
            </div>

            <div>
              <dt className="card-muted">Priority</dt>
              <dd className="font-semibold text-white mt-1">
                {complaint.priority}
              </dd>
            </div>

            <div>
              <dt className="card-muted">Category</dt>
              <dd className="font-semibold text-white mt-1">
                {complaint.category}
              </dd>
            </div>

            <div>
              <dt className="card-muted">Submitted</dt>
              <dd className="font-semibold text-white mt-1">
                {formatDate(complaint.createdAt)}
              </dd>
            </div>

            <div>
              <dt className="card-muted">Last Updated</dt>
              <dd className="font-semibold text-white mt-1">
                {formatDate(complaint.updatedAt)}
              </dd>
            </div>
          </dl>

          {isAdmin && complaint.status !== "Resolved" && (
            <form onSubmit={handleAdminUpdate} className="mt-6 pt-6 border-t border-slate-700 space-y-4">
              <h4 className="text-sm font-semibold text-white">
                Admin Actions
              </h4>

              <div>
                <label className="form-label" htmlFor="admin-status">
                  Status
                </label>
                <select
                  id="admin-status"
                  value={updateForm.status}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="form-input"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="admin-priority">
                  Priority
                </label>
                <select
                  id="admin-priority"
                  value={updateForm.priority}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="form-input"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="admin-note">
                  Note
                  <span className="ml-1 font-normal text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="admin-note"
                  rows={2}
                  value={updateForm.note}
                  onChange={(e) =>
                    setUpdateForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  className="form-textarea"
                  placeholder="Add a note recorded in status history..."
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="form-btn w-full"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ComplaintDetails;
