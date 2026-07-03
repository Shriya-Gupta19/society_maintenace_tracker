import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";

function ResidentNotices() {
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

  return (
    <MainLayout>

      <PageHeader
        title="Notice Board"
        subtitle="Latest society announcements."
      />

      <div className="space-y-5">

        {notices.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-8 text-center">
            No notices available.
          </div>

        ) : (

          notices.map((notice)=>(

            <div
              key={notice._id}
              className="bg-white rounded-2xl shadow p-6"
            >

              <h2 className="text-xl font-bold">
                {notice.title}
              </h2>

              <p className="mt-3 text-gray-600">
                {notice.content}
              </p>

              <p className="mt-5 text-sm text-gray-400">
                Posted by {notice.postedBy?.name}
              </p>

            </div>

          ))

        )}

      </div>

    </MainLayout>
  );
}

export default ResidentNotices;