import {
  LayoutDashboard,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Building2,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const menu = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: isAdmin
        ? "/admin/dashboard"
        : "/resident/dashboard",
    },

    {
      title: "Complaints",
      icon: <ClipboardList size={20} />,
      path: isAdmin
        ? "/admin/complaints"
        : "/resident/complaints",
    },

    {
        title: "Notices",
        icon: <Bell size={20} />,
        path: isAdmin
        ? "/admin/notices"
        : "/resident/notices",
    },

    // Uncomment after Profile module is completed

    // {
    //   title: "Profile",
    //   icon: <User size={20} />,
    //   path: isAdmin
    //     ? "/admin/profile"
    //     : "/resident/profile",
    // },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0F172A] text-white flex flex-col">

      {/* Logo */}

      <div className="px-6 py-8 border-b border-slate-700">

        <div className="flex items-center gap-3">

          <div className="bg-blue-600 p-3 rounded-xl">

            <Building2 size={26} />

          </div>

          <div>

            <h1 className="text-lg font-bold leading-5">
              Society
              <br />
              Tracker
            </h1>

          </div>

        </div>

      </div>

      {/* User */}

      <div className="px-6 py-5 border-b border-slate-700">

        <p className="text-sm text-slate-400">
          Logged in as
        </p>

        <h3 className="font-semibold mt-1">
          {user?.name}
        </h3>

        <span className="inline-block mt-2 text-xs bg-blue-600 px-3 py-1 rounded-full capitalize">
          {user?.role}
        </span>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-3 py-5">

        {menu.map((item) => (

          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-200"
              }`
            }
          >
            {item.icon}

            <span>{item.title}</span>

          </NavLink>

        ))}

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-700 p-4">

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 flex justify-center items-center gap-2 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;