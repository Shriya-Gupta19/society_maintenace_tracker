import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import ActionLink from "../../components/common/ActionLink";
import StatCard from "../../components/common/StatCard";
import api from "../../services/api";

import {
  ClipboardList,
  Clock3,
  CircleCheckBig,
  Bell,
  Plus,
} from "lucide-react";

function ResidentDashboard() {

  const [loading, setLoading] = useState(true);

  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    notices: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const complaintRes = await api.get("/complaints/my");

      const noticeRes = await api.get("/notices");

      const complaintData = complaintRes.data.complaints;
      const noticeData = noticeRes.data.notices;

      setComplaints(complaintData);
      setNotices(noticeData);

      const pending =
        complaintData.filter(
          c =>
            c.status === "Open" ||
            c.status === "In Progress"
        ).length;

      const resolved =
        complaintData.filter(
          c => c.status === "Resolved"
        ).length;

      setStats({
        total: complaintData.length,
        pending,
        resolved,
        notices: noticeData.length,
      });

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

          <div className="text-xl font-semibold text-slate-100">
            Loading Dashboard...
          </div>

        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* Header */}

      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Resident Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Here's an overview of your activity.
          </p>
        </div>

        <ActionLink to="/resident/complaints/create">
          <Plus size={18} />
          New Complaint
        </ActionLink>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Complaints"
          value={stats.total}
          icon={<ClipboardList size={28} />}
          color="bg-blue-600"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock3 size={28} />}
          color="bg-orange-500"
        />

        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CircleCheckBig size={28} />}
          color="bg-green-600"
        />

        <StatCard
          title="Notices"
          value={stats.notices}
          icon={<Bell size={28} />}
          color="bg-purple-600"
        />

      </div>
            {/* Row 2 */}

      <div className="grid xl:grid-cols-3 gap-8 mt-10">

        {/* Latest Notices */}

        <div className="xl:col-span-1 content-card">

          <h2 className="text-xl font-semibold mb-6 text-white">
            Latest Notices
          </h2>

          {
            notices.length === 0 ? (

              <p className="card-muted">
                No notices available.
              </p>

            ) : (

              <div className="space-y-5">

                {
                  notices.slice(0, 5).map((notice) => (
                    <div
                      key={notice._id}
                      className={`border-l-4 pl-4 ${
                        notice.important
                          ? "border-purple-400"
                          : "border-blue-500"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{notice.title}</h3>
                        {notice.important && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                            Important
                          </span>
                        )}
                      </div>

                      <p className="text-sm card-muted mt-1 line-clamp-2">
                        {notice.content}
                      </p>
                    </div>
                  ))
                }

              </div>

            )
          }

        </div>

        {/* Complaint Summary */}

        <div className="xl:col-span-2 content-card">

          <h2 className="text-xl font-semibold mb-6 text-white">
            Complaint Summary
          </h2>

          <div className="grid grid-cols-3 gap-6">

            <div className="stat-box">

              <p className="text-4xl font-bold text-blue-400">
                {stats.total}
              </p>

              <p className="mt-2 card-muted">
                Total
              </p>

            </div>

            <div className="stat-box">

              <p className="text-4xl font-bold text-orange-400">
                {stats.pending}
              </p>

              <p className="mt-2 card-muted">
                Pending
              </p>

            </div>

            <div className="stat-box">

              <p className="text-4xl font-bold text-green-400">
                {stats.resolved}
              </p>

              <p className="mt-2 card-muted">
                Resolved
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Recent Complaints */}

      <div className="content-card mt-10">

        <h2 className="text-xl font-semibold mb-6 text-white">
          My Recent Complaints
        </h2>

        {
          complaints.length === 0 ? (

            <div className="text-center py-8">
              <p className="card-muted mb-4">
                No complaints found.
              </p>
              <ActionLink to="/resident/complaints/create">
                <Plus size={18} />
                Raise a Complaint
              </ActionLink>
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full data-table">

                <thead>

                  <tr>

                    <th>Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {
                    complaints.slice(0,5).map((item)=>(

                      <tr key={item._id}>

                        <td className="text-white font-medium">
                          {item.title}
                        </td>

                        <td>
                          {item.category}
                        </td>

                        <td>
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                            {item.priority}
                          </span>
                        </td>

                        <td>
                          <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                            {item.status}
                          </span>
                        </td>

                      </tr>

                    ))
                  }

                </tbody>

              </table>

            </div>

          )
        }

      </div>

    </MainLayout>
  );
}

export default ResidentDashboard;