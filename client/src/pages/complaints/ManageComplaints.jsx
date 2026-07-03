import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/common/Badge";
import api, { API_BASE } from "../../services/api";
import toast from "react-hot-toast";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [overdueFilter, setOverdueFilter] = useState("All");

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

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/complaints/${id}/status`, { status });
      toast.success("Status updated");
      fetchComplaints();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update status"
      );
    }
  };

  const updatePriority = async (id, priority) => {
    try {
      await api.patch(`/admin/complaints/${id}/priority`, { priority });
      toast.success("Priority updated");
      fetchComplaints();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update priority"
      );
    }
  };

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.resident?.name?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;

        const matchesPriority =
          priorityFilter === "All" || item.priority === priorityFilter;

        const matchesOverdue =
          overdueFilter === "All" ||
          (overdueFilter === "Overdue" && item.overdue) ||
          (overdueFilter === "On Track" && !item.overdue);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesOverdue
        );
      })
      .sort((a, b) => {
        if (a.overdue !== b.overdue) {
          return a.overdue ? -1 : 1;
        }

        const priorityRank = { High: 3, Medium: 2, Low: 1 };
        return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
      });
  }, [complaints, search, statusFilter, priorityFilter, overdueFilter]);

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

  return (
    <MainLayout>
      <PageHeader
        title="Manage Complaints"
        subtitle="Overdue complaints are pinned at the top. Update status and priority with full history tracking."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search complaints..."
            className="border rounded-xl px-4 py-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl px-4 py-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select
            className="border rounded-xl px-4 py-3"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            className="border rounded-xl px-4 py-3"
            value={overdueFilter}
            onChange={(e) => setOverdueFilter(e.target.value)}
          >
            <option>All</option>
            <option>Overdue</option>
            <option>On Track</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-16 text-lg font-medium">
            Loading complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No complaints found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="text-left p-4">Resident</th>
                  <th className="text-left p-4">Complaint</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Photo</th>
                  <th className="text-left p-4">Priority</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Overdue</th>
                  <th className="text-left p-4">Update</th>
                  <th className="text-left p-4">View</th>
                </tr>
              </thead>

              <tbody>
                {filteredComplaints.map((item) => (
                  <tr
                    key={item._id}
                    className={`border-b transition ${
                      item.overdue
                        ? "bg-red-50 hover:bg-red-100/70"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{item.resident?.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.resident?.flatNumber}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    </td>

                    <td className="p-4">{item.category}</td>

                    <td className="p-4">
                      {item.photo ? (
                        <img
                          src={`${API_BASE}${item.photo}`}
                          alt="complaint"
                          className="w-16 h-16 rounded-lg object-cover border"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
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
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(item._id, e.target.value)
                        }
                        className="w-full border rounded-lg p-2"
                      >
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Resolved</option>
                      </select>

                      <select
                        value={item.priority}
                        onChange={(e) =>
                          updatePriority(item._id, e.target.value)
                        }
                        className="w-full border rounded-lg p-2"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/admin/complaints/${item._id}`}
                        className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-700"
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
    </MainLayout>
  );
}

export default ManageComplaints;
