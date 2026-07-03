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
        <div className="text-center py-20">
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

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow border border-slate-200 p-8">

        <div className="flex items-center gap-6 mb-8">

          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">

            {form.name.charAt(0)}

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              {form.name}
            </h2>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm capitalize">

              {form.role}

            </span>

          </div>

        </div>

        <form
          onSubmit={saveProfile}
          className="grid md:grid-cols-2 gap-6"
        >

          <div>

            <label>Name</label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>Email</label>

            <input
              className="w-full border rounded-xl p-3 mt-2 bg-gray-100"
              value={form.email}
              disabled
            />

          </div>

          <div>

            <label>Phone</label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

          </div>

          <div>

            <label>Flat Number</label>

            <input
              className="w-full border rounded-xl p-3 mt-2"
              name="flatNumber"
              value={form.flatNumber}
              onChange={handleChange}
            />

          </div>

          <div className="md:col-span-2">

            <button
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
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