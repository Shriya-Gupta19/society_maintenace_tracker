import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/common/Badge";
import api, { API_BASE } from "../../services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Security",
  "Cleaning",
  "Parking",
  "Lift",
  "Other",
];

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [overdueFilter, setOverdueFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [selectKeys, setSelectKeys] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/complaints");
      setComplaints(data.complaints);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmUpdate = async () => {
    if (!pendingUpdate) return;

    const { complaintId, field, value, note } = pendingUpdate;

    try {
      if (field === "status") {
        await api.patch(`/admin/complaints/${complaintId}/status`, {
          status: value,
          note: note.trim() || undefined,
        });
        toast.success("Status updated");
      } else {
        await api.patch(`/admin/complaints/${complaintId}/priority`, {
          priority: value,
          note: note.trim() || undefined,
        });
        toast.success("Priority updated");
      }

      setPendingUpdate(null);
      fetchComplaints();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update complaint"
      );
    }
  };

  const cancelUpdate = () => {
    if (pendingUpdate) {
      setSelectKeys((prev) => ({
        ...prev,
        [pendingUpdate.complaintId]: Date.now(),
      }));
    }
    setPendingUpdate(null);
  };

  const handleStatusChange = (complaint, newStatus) => {
    if (newStatus === complaint.status) return;

    setPendingUpdate({
      complaintId: complaint._id,
      field: "status",
      value: newStatus,
      note: "",
      label: `Update status to "${newStatus}"`,
    });
  };

  const handlePriorityChange = (complaint, newPriority) => {
    if (newPriority === complaint.priority) return;

    setPendingUpdate({
      complaintId: complaint._id,
      field: "priority",
      value: newPriority,
      note: "",
      label: `Update priority to "${newPriority}"`,
    });
  };

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.resident?.name?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          categoryFilter === "All" || item.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;

        const matchesPriority =
          priorityFilter === "All" || item.priority === priorityFilter;

        const matchesOverdue =
          overdueFilter === "All" ||
          (overdueFilter === "Overdue" && item.overdue) ||
          (overdueFilter === "On Track" && !item.overdue);

        const createdAt = new Date(item.createdAt);
        const matchesDateFrom =
          !dateFrom || createdAt >= new Date(`${dateFrom}T00:00:00`);
        const matchesDateTo =
          !dateTo || createdAt <= new Date(`${dateTo}T23:59:59`);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesPriority &&
          matchesOverdue &&
          matchesDateFrom &&
          matchesDateTo
        );
      })
      .sort((a, b) => {
        if (a.overdue !== b.overdue) {
          return a.overdue ? -1 : 1;
        }

        const priorityRank = { High: 3, Medium: 2, Low: 1 };
        return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
      });
  }, [
    complaints,
    search,
    categoryFilter,
    statusFilter,
    priorityFilter,
    overdueFilter,
    dateFrom,
    dateTo,
  ]);

  const statusColor = (status) => {
    if (status === "Resolved") return "green";
    if (status === "In Progress") return "blue";
    return "yellow";
  };

  const priorityColor = (priority) => {
    if (priority === "High") return "red";
    if (priority === "Medium") return "orange";
    return "green";
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <MainLayout>
      <PageHeader
        title="Manage Complaints"
        subtitle="Filter by category, status, or date. Overdue complaints are pinned at the top."
      />

      <div className="content-card">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title or resident..."
            className="filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            className="filter-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select
            className="filter-input"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            className="filter-input"
            value={overdueFilter}
            onChange={(e) => setOverdueFilter(e.target.value)}
          >
            <option value="All">All (Overdue)</option>
            <option>Overdue</option>
            <option>On Track</option>
          </select>

          <input
            type="date"
            className="filter-input"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="From date"
          />

          <input
            type="date"
            className="filter-input"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="To date"
          />
        </div>

        {(dateFrom || dateTo || categoryFilter !== "All") && (
          <p className="text-xs card-muted mb-6">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </p>
        )}

        {loading ? (
          <div className="text-center py-16 text-lg font-medium card-muted">
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-16 card-muted">
            No complaints found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="p-4">Resident</th>
                  <th className="p-4">Complaint</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Photo</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Overdue</th>
                  <th className="p-4">Update</th>
                  <th className="p-4">View</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map((item) => (
                  <tr
                    key={item._id}
                    className={item.overdue ? "row-overdue" : ""}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-white">{item.resident?.name}</p>
                        <p className="text-sm card-muted">
                          {item.resident?.flatNumber}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="text-sm card-muted line-clamp-2">
                        {item.description}
                      </p>
                    </td>

                    <td className="p-4">{item.category}</td>

                    <td className="p-4 text-sm card-muted whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="p-4">
                      {item.photo ? (
                        <img
                          src={`${API_BASE}${item.photo}`}
                          alt="complaint"
                          className="w-16 h-16 rounded-lg object-cover border border-slate-600"
                        />
                      ) : (
                        <span className="card-muted">No Image</span>
                      )}
                    </td>

                    <td className="p-4">
                      <Badge color={priorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </td>

                    <td className="p-4">
                      <Badge color={statusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </td>

                    <td className="p-4">
                      {item.overdue ? (
                        <Badge color="red">Overdue</Badge>
                      ) : (
                        <Badge color="green">On Track</Badge>
                      )}
                    </td>

                    <td className="p-4 space-y-3">
                      <select
                        key={`status-${item._id}-${selectKeys[item._id] || ""}`}
                        defaultValue={item.status}
                        onChange={(e) =>
                          handleStatusChange(item, e.target.value)
                        }
                        className="filter-input"
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>

                      <select
                        key={`priority-${item._id}-${selectKeys[item._id] || ""}`}
                        defaultValue={item.priority}
                        onChange={(e) =>
                          handlePriorityChange(item, e.target.value)
                        }
                        className="filter-input"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/admin/complaints/${item._id}`}
                        className="inline-flex items-center gap-1 text-blue-400 font-semibold hover:text-blue-300"
                      >
                        <Eye size={16} />
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="form-card w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-1">
              Confirm Update
            </h3>
            <p className="text-sm card-muted mb-4">{pendingUpdate.label}</p>

            <label className="form-label" htmlFor="update-note">
              Note (optional)
            </label>
            <textarea
              id="update-note"
              rows={3}
              value={pendingUpdate.note}
              onChange={(e) =>
                setPendingUpdate((prev) => ({ ...prev, note: e.target.value }))
              }
              className="form-textarea mb-4"
              placeholder="Add a note for the status history..."
            />

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={cancelUpdate}
                className="px-4 py-2 rounded-xl border border-slate-600 text-sm font-semibold card-body hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmUpdate}
                className="form-btn px-4 py-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default ManageComplaints;
