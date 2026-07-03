import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/common/Badge";
import api from "../../services/api";
import toast from "react-hot-toast";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/admin/complaints");
      console.log(data);
      setComplaints(data.complaints);
      console.log(data.complaints);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load complaints"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {

      await api.patch(
        `/admin/complaints/${id}/status`,
        { status }
      );

      toast.success("Status Updated");

      fetchComplaints();

    } catch (error) {

      toast.error("Unable to update status");

    }
  };

  const updatePriority = async (id, priority) => {
    try {

      await api.patch(
        `/admin/complaints/${id}/priority`,
        { priority }
      );

      toast.success("Priority Updated");

      fetchComplaints();

    } catch (error) {

      toast.error("Unable to update priority");

    }
  };

  const filteredComplaints = useMemo(() => {

    return complaints.filter((item) => {

      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.resident?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );

    });

  }, [
    complaints,
    search,
    statusFilter,
    priorityFilter,
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

  return (
    <MainLayout>

      <PageHeader
        title="Manage Complaints"
        subtitle="Manage all society complaints."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <input
            type="text"
            placeholder="Search..."
            className="border rounded-xl px-4 py-3"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />

          <select
            className="border rounded-xl px-4 py-3"
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

          <select
            className="border rounded-xl px-4 py-3"
            value={priorityFilter}
            onChange={(e)=>setPriorityFilter(e.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
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
                  <th className="text-left p-4">Update</th>

                </tr>

              </thead>

              <tbody>

                {filteredComplaints.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="p-4">

                      <div>

                        <p className="font-semibold">
                          {item.resident?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.resident?.flatNumber}
                        </p>

                      </div>

                    </td>

                    <td className="p-4">

                      <p className="font-medium">
                        {item.title}
                      </p>

                      <p className="text-sm text-gray-500 line-clamp-2">
                        {item.description}
                      </p>

                    </td>

                    <td className="p-4">
                      {item.category}
                    </td>

                    <td className="p-4">

                      {item.photo ? (

                        <img
                          src={`http://localhost:5000${item.photo}`}
                          alt="complaint"
                          className="w-16 h-16 rounded-lg object-cover border"
                        />

                      ) : (

                        <span className="text-gray-400">
                          No Image
                        </span>

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

                    <td className="p-4 space-y-3">

                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(
                            item._id,
                            e.target.value
                          )
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
                          updatePriority(
                            item._id,
                            e.target.value
                          )
                        }
                        className="w-full border rounded-lg p-2"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>

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