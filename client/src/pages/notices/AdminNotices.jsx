import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";
import toast from "react-hot-toast";

function AdminNotices() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get("/notices");
      setNotices(data.notices);
    } catch (err) {
      console.log(err);
    }
  };

  const submitNotice = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/notices", {
        title,
        content,
      });

      toast.success(data.message);

      setTitle("");
      setContent("");

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
      />

      <div className="grid lg:grid-cols-3 gap-8">

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-5">
            Create Notice
          </h2>

          <form
            onSubmit={submitNotice}
            className="space-y-4"
          >

            <input
              className="w-full border rounded-xl p-3"
              placeholder="Notice Title"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />

            <textarea
              rows={6}
              className="w-full border rounded-xl p-3"
              placeholder="Notice Content"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3"
            >
              {loading ? "Posting..." : "Post Notice"}
            </button>

          </form>

        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            All Notices
          </h2>

          {notices.length === 0 ? (

            <p className="text-gray-500">
              No notices available.
            </p>

          ) : (

            notices.map((notice)=>(

              <div
                key={notice._id}
                className="border rounded-xl p-5 mb-4"
              >

                <h3 className="text-lg font-bold">
                  {notice.title}
                </h3>

                <p className="text-gray-600 mt-2">
                  {notice.content}
                </p>

                <p className="text-sm text-gray-400 mt-4">
                  Posted by {notice.postedBy?.name}
                </p>

              </div>

            ))

          )}

        </div>

      </div>

    </MainLayout>
  );
}

export default AdminNotices;