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

          <div className="text-xl font-semibold">
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
          <h1 className="text-3xl font-bold text-slate-800">
            Resident Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
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

        <div className="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-semibold mb-6">
            Latest Notices
          </h2>

          {
            notices.length === 0 ? (

              <p className="text-gray-500">
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
                          ? "border-purple-500"
                          : "border-blue-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{notice.title}</h3>
                        {notice.important && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                            Important
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
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

        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

          <h2 className="text-xl font-semibold mb-6">
            Complaint Summary
          </h2>

          <div className="grid grid-cols-3 gap-6">

            <div className="bg-slate-50 rounded-xl p-6 text-center">

              <p className="text-4xl font-bold text-blue-600">
                {stats.total}
              </p>

              <p className="mt-2 text-gray-500">
                Total
              </p>

            </div>

            <div className="bg-slate-50 rounded-xl p-6 text-center">

              <p className="text-4xl font-bold text-orange-500">
                {stats.pending}
              </p>

              <p className="mt-2 text-gray-500">
                Pending
              </p>

            </div>

            <div className="bg-slate-50 rounded-xl p-6 text-center">

              <p className="text-4xl font-bold text-green-600">
                {stats.resolved}
              </p>

              <p className="mt-2 text-gray-500">
                Resolved
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Recent Complaints */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-10">

        <h2 className="text-xl font-semibold mb-6">
          My Recent Complaints
        </h2>

        {
          complaints.length === 0 ? (

            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                No complaints found.
              </p>
              <ActionLink to="/resident/complaints/create">
                <Plus size={18} />
                Raise a Complaint
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

                  </tr>

                </thead>

                <tbody>

                  {
                    complaints.slice(0,5).map((item)=>(

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
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm">
                            {item.priority}
                          </span>
                        </td>

                        <td>
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm">
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