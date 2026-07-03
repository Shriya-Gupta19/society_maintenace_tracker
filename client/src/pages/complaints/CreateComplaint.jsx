import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";
import toast from "react-hot-toast";

function CreateComplaint() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);

      if (photo) {
        formData.append("photo", photo);
      }

      const { data } = await api.post(
        "/complaints",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);

      navigate("/resident/complaints");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to submit complaint"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>

      <PageHeader
        title="Raise Complaint"
        subtitle="Submit a new complaint."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Complaint Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="Enter title"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >

              <option value="">Select Category</option>

              <option>Electrical</option>
              <option>Plumbing</option>
              <option>Security</option>
              <option>Cleaning</option>
              <option>Parking</option>
              <option>Lift</option>
              <option>Other</option>

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              placeholder="Describe your issue..."
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPhoto(e.target.files[0])
              }
            />

          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
          >

            {loading
              ? "Submitting..."
              : "Submit Complaint"}

          </button>

        </form>

      </div>

    </MainLayout>
  );
}

export default CreateComplaint;