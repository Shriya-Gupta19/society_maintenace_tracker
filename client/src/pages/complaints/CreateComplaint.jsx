import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Security",
  "Cleaning",
  "Parking",
  "Lift",
  "Other",
];

function CreateComplaint() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Please enter a complaint title");
      return;
    }

    if (!form.category) {
      toast.error("Please select a category");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Please describe your issue");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("category", form.category);
      formData.append("description", form.description.trim());

      if (photo) {
        formData.append("photo", photo);
      }

      const { data } = await api.post("/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
      navigate("/resident/complaints");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Raise Complaint"
        subtitle="Submit a new maintenance request with optional photo."
      />

      <Link
        to="/resident/complaints"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to My Complaints
      </Link>

      <div className="form-card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label" htmlFor="title">
              Complaint Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Brief title for your complaint"
              required
            />
          </div>

          <div>
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe your issue in detail..."
              required
            />
          </div>

          <div>
            <label className="form-label" htmlFor="photo">
              Upload Photo (optional)
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-4 w-40 h-40 rounded-xl object-cover border border-slate-200"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="form-btn"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>

            <Link
              to="/resident/complaints"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default CreateComplaint;
