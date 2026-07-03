import { useEffect, useState } from "react";
import { Pin } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Badge from "../../components/common/Badge";
import api from "../../services/api";
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

function ResidentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get("/notices");
      setNotices(data.notices);
    } catch (err) {
      toast.error("Unable to load notices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Notice Board"
        subtitle="Latest society announcements."
      />

      {loading ? (
        <div className="form-card text-center py-12 card-muted">
          Loading notices...
        </div>
      ) : notices.length === 0 ? (
        <div className="form-card text-center py-12 card-muted">
          No notices available at the moment.
        </div>
      ) : (
        <div className="space-y-5">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className={`notice-card ${
                notice.important ? "notice-card-important" : ""
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <h2 className="text-xl font-bold text-white">
                  {notice.title}
                </h2>

                {notice.important && (
                  <Badge color="purple">
                    <span className="inline-flex items-center gap-1">
                      <Pin size={12} />
                      Pinned
                    </span>
                  </Badge>
                )}
              </div>

              <p className="card-body leading-relaxed mt-3">
                {notice.content}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-5 text-sm card-muted">
                <span>Posted by {notice.postedBy?.name}</span>
                <span>{formatDate(notice.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

export default ResidentNotices;
