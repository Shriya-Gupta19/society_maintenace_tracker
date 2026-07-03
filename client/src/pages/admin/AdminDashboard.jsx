import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import StatCard from "../../components/common/StatCard";
import api from "../../services/api";

import {
  ClipboardList,
  Clock3,
  CircleCheckBig,
  TriangleAlert,
} from "lucide-react";

function AdminDashboard() {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalComplaints: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
  });

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const dashboardRes = await api.get("/admin/dashboard");
      const complaintsRes = await api.get("/admin/complaints");

      setStats(dashboardRes.data.dashboard);
      setComplaints(complaintsRes.data.complaints);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold">
            Loading Dashboard...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-3xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Society overview and complaint management.
        </p>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={<ClipboardList size={28}/>}
          color="bg-blue-600"
        />

        <StatCard
          title="Open"
          value={stats.open}
          icon={<Clock3 size={28}/>}
          color="bg-orange-500"
        />

        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CircleCheckBig size={28}/>}
          color="bg-green-600"
        />

        <StatCard
          title="High Priority"
          value={stats.highPriority}
          icon={<TriangleAlert size={28}/>}
          color="bg-red-600"
        />

      </div>
            {/* Analytics + Quick Summary */}

      <div className="grid xl:grid-cols-3 gap-8 mt-10">

        {/* Analytics */}

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-semibold mb-6">
            Complaint Analytics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div className="bg-blue-50 rounded-xl p-6 text-center">

              <h3 className="text-4xl font-bold text-blue-600">
                {stats.totalComplaints}
              </h3>

              <p className="mt-2 text-gray-500">
                Total
              </p>

            </div>

            <div className="bg-orange-50 rounded-xl p-6 text-center">

              <h3 className="text-4xl font-bold text-orange-500">
                {stats.open}
              </h3>

              <p className="mt-2 text-gray-500">
                Open
              </p>

            </div>

            <div className="bg-yellow-50 rounded-xl p-6 text-center">

              <h3 className="text-4xl font-bold text-yellow-600">
                {stats.inProgress}
              </h3>

              <p className="mt-2 text-gray-500">
                In Progress
              </p>

            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">

              <h3 className="text-4xl font-bold text-green-600">
                {stats.resolved}
              </h3>

              <p className="mt-2 text-gray-500">
                Resolved
              </p>

            </div>

          </div>

        </div>

        {/* High Priority */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-semibold mb-6">
            High Priority
          </h2>

          <div className="flex flex-col justify-center items-center h-[220px]">

            <div className="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center">

              <span className="text-5xl font-bold text-red-600">
                {stats.highPriority}
              </span>

            </div>

            <p className="mt-6 text-gray-500">
              High Priority Complaints
            </p>

          </div>

        </div>

      </div>

      {/* Complaints Table */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-10">

        <h2 className="text-xl font-semibold mb-6">
          Recent Complaints
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b">

              <tr className="text-left">

                <th className="pb-4">Resident</th>
                <th className="pb-4">Complaint</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Priority</th>
                <th className="pb-4">Status</th>

              </tr>

            </thead>

            <tbody>

              {complaints.slice(0,8).map((item)=>(
                <tr
                  key={item._id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  <td className="py-4">
                    {item.resident?.name}
                  </td>

                  <td>
                    {item.title}
                  </td>

                  <td>
                    {item.category}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      ${
                        item.priority==="High"
                        ? "bg-red-100 text-red-600"
                        : item.priority==="Medium"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                      }`}
                    >

                      {item.priority}

                    </span>

                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-sm
                      ${
                        item.status==="Resolved"
                        ? "bg-green-100 text-green-600"
                        : item.status==="In Progress"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-yellow-100 text-yellow-600"
                      }`}
                    >

                      {item.status}

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  );
}

export default AdminDashboard;