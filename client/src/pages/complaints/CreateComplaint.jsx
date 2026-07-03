import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, ImagePlus, X } from "lucide-react";
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

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

function CreateComplaint() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  const validateAndSetPhoto = (file) => {
    if (!file) {
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Only JPEG and PNG images are allowed");
      return;
    }

    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Photo must be smaller than 5 MB");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoChange = (e) => {
    validateAndSetPhoto(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSetPhoto(e.dataTransfer.files[0]);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

      const { data } = await api.post("/complaints", formData);

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
        subtitle="Submit a maintenance request with category, description, and an optional supporting photo."
      />

      <Link
        to="/resident/complaints"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 mb-6 transition-colors"
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
            <label className="form-label">
              Supporting Photo
              <span className="ml-1 font-normal text-slate-400">(optional)</span>
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Attach a photo to help admins understand the issue. JPEG or PNG, max 5 MB.
            </p>

            {!photoPreview ? (
              <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    fileInputRef.current?.click();
                  }
                }}
                className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${
                  dragOver
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-slate-600 bg-slate-800/50 hover:border-blue-400 hover:bg-blue-500/5"
                }`}
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 text-blue-400">
                  <ImagePlus size={28} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs card-muted mt-1">
                    JPEG, PNG up to 5 MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  id="photo"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative shrink-0">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-40 h-40 rounded-xl object-cover border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                    aria-label="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                    <Camera size={16} className="text-blue-400 shrink-0" />
                    <span className="truncate">{photo?.name}</span>
                  </div>
                  <p className="text-xs card-muted mt-1">
                    {photo && formatFileSize(photo.size)}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 text-sm text-blue-400 font-semibold hover:text-blue-300"
                  >
                    Change photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              </div>
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
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-slate-600 text-sm font-semibold card-body hover:bg-slate-800 transition-colors"
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
