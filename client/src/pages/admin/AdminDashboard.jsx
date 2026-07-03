import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import ActionLink from "../../components/common/ActionLink";
import StatCard from "../../components/common/StatCard";
import ComplaintChart from "../../components/dashboard/ComplaintChart";
import CategoryChart from "../../components/dashboard/CategoryChart";
import MonthlyTrendChart from "../../components/dashboard/MonthlyTrendChart";
import api from "../../services/api";
import toast from "react-hot-toast";

import {
  ClipboardList,
  Clock3,
  CircleCheckBig,
  Plus,
  Download,
  AlertTriangle,
} from "lucide-react";

function AdminDashboard() {

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalComplaints: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    highPriority: 0,
    overdue: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const dashboardRes = await api.get("/admin/dashboard");
      const complaintsRes = await api.get("/admin/complaints");

      setStats(dashboardRes.data.dashboard);
      setCategoryStats(dashboardRes.data.categoryStats || []);
      setMonthlyStats(dashboardRes.data.monthlyStats || []);
      setComplaints(complaintsRes.data.complaints);

    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {

      setLoading(false);

    }
  };

  const downloadReport = async () => {
    try {
      const response = await api.get("/admin/reports/complaints", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "complaints-report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded");
    } catch (error) {
      toast.error("Unable to download report");
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

      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Society overview and complaint management.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ActionLink to="/admin/notices#create-notice">
            <Plus size={18} />
            New Notice
          </ActionLink>

          <button
            type="button"
            onClick={downloadReport}
            className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

      </div>

      {/* Statistics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          icon={<ClipboardList size={28} />}
          color="bg-blue-600"
        />

        <StatCard
          title="Open"
          value={stats.open}
          icon={<Clock3 size={28} />}
          color="bg-orange-500"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Clock3 size={28} />}
          color="bg-yellow-500"
        />

        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={<AlertTriangle size={28} />}
          color="bg-red-600"
        />

        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CircleCheckBig size={28} />}
          color="bg-green-600"
        />
      </div>

      {/* Analytics */}

      <div className="grid xl:grid-cols-3 gap-8 mt-10">

        <div className="xl:col-span-2">

          <ComplaintChart stats={stats} />

        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-semibold mb-6">
            Quick Summary
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">
              <span>Total Complaints</span>
              <span className="font-bold text-blue-600">
                {stats.totalComplaints}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Open</span>
              <span className="font-bold text-orange-500">
                {stats.open}
              </span>
            </div>

            <div className="flex justify-between">
              <span>In Progress</span>
              <span className="font-bold text-yellow-600">
                {stats.inProgress}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Resolved</span>
              <span className="font-bold text-green-600">
                {stats.resolved}
              </span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>Overdue</span>
              <span className="font-bold text-red-600">
                {stats.overdue}
              </span>
            </div>

            <div className="flex justify-between">
              <span>High Priority (Open)</span>
              <span className="font-bold text-red-600">
                {stats.highPriority}
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Recent Complaints */}

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
                            {complaints.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-10 text-center text-gray-500"
                  >
                    No complaints found.
                  </td>

                </tr>

              ) : (

                complaints.slice(0, 8).map((item) => (

                  <tr
                    key={item._id}
                    className={`border-b transition ${
                      item.overdue ? "bg-red-50" : "hover:bg-slate-50"
                    }`}
                  >

                    <td className="py-4">

                      <div>

                        <p className="font-semibold">
                          {item.resident?.name || "N/A"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.resident?.flatNumber || "-"}
                        </p>

                      </div>

                    </td>

                    <td>

                      <Link
                        to={`/admin/complaints/${item._id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {item.title}
                      </Link>

                      <p className="text-sm text-gray-500">
                        {item.description?.length > 45
                          ? item.description.substring(0, 45) + "..."
                          : item.description}
                      </p>

                    </td>

                    <td>
                      {item.category}
                    </td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.priority === "High"
                            ? "bg-red-100 text-red-600"
                            : item.priority === "Medium"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {item.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.status === "Resolved"
                            ? "bg-green-100 text-green-600"
                            : item.status === "In Progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

            {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        <CategoryChart
          data={categoryStats}
        />

        <MonthlyTrendChart
          data={monthlyStats}
        />

      </div>

    </MainLayout>
  );
}

export default AdminDashboard;

        