import {
  LayoutDashboard,
  ClipboardList,
  Bell,
  User,
  LogOut,
  Building2,
  X,
  Plus,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const basePath = isAdmin ? "/admin" : "/resident";

  const menu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: `${basePath}/dashboard`,
    },
    {
      title: "Complaints",
      icon: ClipboardList,
      path: `${basePath}/complaints`,
    },
    {
      title: "Notices",
      icon: Bell,
      path: `${basePath}/notices`,
    },
    {
      title: "Profile",
      icon: User,
      path: `${basePath}/profile`,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 shrink-0 lg:min-h-screen sidebar-bg border-r border-slate-800/80 text-white flex flex-col shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/30">
              <Building2 size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-base font-bold leading-tight truncate">
                Society
              </p>
              <h2 className="text-base font-bold leading-tight truncate">
                Maintenance Tracker
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-white/10">
        <p className="text-xs text-slate-400 uppercase tracking-wide">
          Signed in as
        </p>
        <p className="font-semibold mt-1 truncate">{user?.name}</p>
        <span className="inline-flex mt-2 text-[11px] font-medium bg-blue-600/90 px-2.5 py-1 rounded-full capitalize">
          {user?.role}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.title === "Dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
                <Icon size={18} />
              </span>
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        {isAdmin ? (
          <Link
            to="/admin/notices#create-notice"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            New Notice
          </Link>
        ) : (
          <Link
            to="/resident/complaints/create"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            New Complaint
          </Link>
        )}
      </div>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600/90 hover:bg-red-600 rounded-xl py-2.5 text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
