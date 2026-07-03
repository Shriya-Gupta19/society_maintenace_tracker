import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import api from "../../services/api";
import toast from "react-hot-toast";

function ResidentProfile() {

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    flatNumber: "",
    role: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const { data } = await api.get("/auth/profile");

      setForm(data.user);

    } catch (err) {

      toast.error("Unable to load profile");

    } finally {

      setLoading(false);

    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      const { data } = await api.put(
        "/auth/profile",
        {
          name: form.name,
          phone: form.phone,
          flatNumber: form.flatNumber,
        }
      );

      toast.success(data.message);

    } catch (err) {

      toast.error("Unable to update profile");

    } finally {

      setSaving(false);

    }

  };

  if (loading) {
    return (
      <MainLayout>
        <div className="text-center py-20 card-muted">
          Loading...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <PageHeader
        title="My Profile"
        subtitle="Manage your account."
      />

      <div className="form-card max-w-4xl mx-auto">

        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">

          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shrink-0">

            {form.name.charAt(0)}

          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              {form.name}
            </h2>

            <span className="inline-block mt-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm capitalize font-medium">

              {form.role}

            </span>

          </div>

        </div>

        <form
          onSubmit={saveProfile}
          className="grid md:grid-cols-2 gap-6"
        >

          <div>

            <label className="form-label" htmlFor="name">Name</label>

            <input
              id="name"
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

          </div>

          <div>

            <label className="form-label" htmlFor="email">Email</label>

            <input
              id="email"
              className="form-input"
              value={form.email}
              disabled
            />

          </div>

          <div>

            <label className="form-label" htmlFor="phone">Phone</label>

            <input
              id="phone"
              className="form-input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

          </div>

          <div>

            <label className="form-label" htmlFor="flatNumber">Flat Number</label>

            <input
              id="flatNumber"
              className="form-input"
              name="flatNumber"
              value={form.flatNumber}
              onChange={handleChange}
            />

          </div>

          <div className="md:col-span-2 pt-2">

            <button
              type="submit"
              disabled={saving}
              className="form-btn"
            >

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </form>

      </div>

    </MainLayout>
  );
}

export default ResidentProfile;
