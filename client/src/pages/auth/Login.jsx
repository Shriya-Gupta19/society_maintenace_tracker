import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

      const { data } = await api.post("/auth/login", formData);

      login(data.user, data.token);

      toast.success("Login Successful");

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/resident/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid Credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <Card className="w-full max-w-md">

        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-full">
            <Building2 className="text-white" size={34} />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-center">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Society Maintenance Tracker
        </p>

        <form onSubmit={handleSubmit}>

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            text={loading ? "Logging In..." : "Login"}
            disabled={loading}
          />

        </form>

        <p className="text-center mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 ml-2 font-semibold"
          >
            Register
          </Link>

        </p>

      </Card>

    </div>
  );
}

export default Login;