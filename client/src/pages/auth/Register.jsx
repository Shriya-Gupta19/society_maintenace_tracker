import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    flatNumber: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await api.post("/auth/register", formData);

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);
      console.log(error.response);
       console.log(error.response?.data);

      toast.error(
        error.response?.data?.message ||error.message|| "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <Card className="w-full max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <Building2 className="text-white" size={34} />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Society Maintenance Tracker
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Name"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
          />

          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
          />

          <Input
            label="Flat Number"
            name="flatNumber"
            value={formData.flatNumber}
            onChange={handleChange}
            placeholder="A-101"
          />

          <Button
            text={loading ? "Creating Account..." : "Register"}
            disabled={loading}
            type="submit"
          />
        </form>

        <p className="text-center mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 ml-2 font-semibold"
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Register;