import { useEffect, useState } from "react";
import { Pin, Plus } from "lucide-react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import ActionLink from "../../components/common/ActionLink";
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

function AdminNotices() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [important, setImportant] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setFetching(true);
      const { data } = await api.get("/notices");
      setNotices(data.notices);
    } catch (err) {
      toast.error("Unable to load notices");
    } finally {
      setFetching(false);
    }
  };

  const submitNotice = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/notices", {
        title: title.trim(),
        content: content.trim(),
        important,
      });

      toast.success(data.message);

      setTitle("");
      setContent("");
      setImportant(false);

      fetchNotices();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Unable to create notice"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Manage Notices"
        subtitle="Create and manage society notices."
        button={
          <ActionLink to="/admin/notices#create-notice">
            <Plus size={18} />
            New Notice
          </ActionLink>
        }
      />

      <div className="grid lg:grid-cols-3 gap-8">
        <div
          id="create-notice"
          className="form-card scroll-mt-24"
        >
          <h2 className="text-xl font-semibold mb-5 text-slate-800">
            Create Notice
          </h2>

          <form onSubmit={submitNotice} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="notice-title">
                Notice Title
              </label>
              <input
                id="notice-title"
                className="form-input"
                placeholder="Enter notice title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label" htmlFor="notice-content">
                Notice Content
              </label>
              <textarea
                id="notice-content"
                rows={6}
                className="form-textarea"
                placeholder="Write the notice content..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                Mark as important (pins to top of notice board)
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="form-btn w-full"
            >
              {loading ? "Posting..." : "Post Notice"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 form-card">
          <h2 className="text-xl font-semibold mb-6 text-slate-800">
            All Notices
          </h2>

          {fetching ? (
            <p className="text-slate-500 text-center py-10">
              Loading notices...
            </p>
          ) : notices.length === 0 ? (
            <p className="text-slate-500 text-center py-10">
              No notices available. Create your first notice.
            </p>
          ) : (
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice._id}
                  className={`notice-card ${
                    notice.important ? "notice-card-important" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">
                      {notice.title}
                    </h3>

                    {notice.important && (
                      <Badge color="purple">
                        <span className="inline-flex items-center gap-1">
                          <Pin size={12} />
                          Important
                        </span>
                      </Badge>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    {notice.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-4 text-sm text-slate-400">
                    <span>Posted by {notice.postedBy?.name}</span>
                    <span>{formatDate(notice.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminNotices;
