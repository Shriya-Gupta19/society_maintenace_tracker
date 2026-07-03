import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import ActionLink from "../../components/common/ActionLink";
import Badge from "../../components/common/Badge";
import api, { API_BASE } from "../../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    let data = complaints;

    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (search) {
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredComplaints(data);
  }, [search, statusFilter, complaints]);

  const fetchComplaints = async () => {
    console.log("fetchComplaints called");
    
    try {
        const res = await api.get("/complaints/my");
        
        console.log("Response:", res.data);

        setComplaints(res.data.complaints);
        setFilteredComplaints(res.data.complaints);
      } catch (err) {
        console.log("API Error:", err);
      } finally {
        setLoading(false);
    }
 };

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
        title="My Complaints"
        subtitle="Track all your submitted complaints."
        button={
          <ActionLink to="/resident/complaints/create">
            <Plus size={18} />
            New Complaint
          </ActionLink>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">

          <input
            type="text"
            placeholder="Search Complaint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full md:w-80"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-4 py-2"
          >
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>

        </div>

        {loading ? (
          <div className="text-center py-10">
            Loading Complaints...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No complaints found.
            </p>
            <ActionLink to="/resident/complaints/create">
              <Plus size={18} />
              Raise Your First Complaint
            </ActionLink>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b">

                <tr className="text-left">

                  <th className="pb-4">Title</th>
                  <th className="pb-4">Category</th>
                  <th className="pb-4">Priority</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Overdue</th>
                  <th className="pb-4">Photo</th>
                  <th className="pb-4">Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredComplaints.map((item) => (

                  <tr
                    key={item._id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="py-4">
                      {item.title}
                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>
                      <Badge color={priorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </td>

                    <td>
                      <Badge color={statusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </td>

                    <td>
                      {item.overdue && item.status !== "Resolved" ? (
                        <Badge color="red">Overdue</Badge>
                      ) : (
                        <span className="text-sm text-slate-400">—</span>
                      )}
                    </td>

                    <td>

                      {item.photo ? (

                        <img
                          src={`${API_BASE}${item.photo}`}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover"
                        />

                      ) : (

                        "No Image"

                      )}

                    </td>

                    <td>

                      <Link
                        to={`/resident/complaints/${item._id}`}
                        className="text-blue-600 font-semibold hover:text-blue-700"
                      >
                        View
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

export default MyComplaints;